-- ============================================================
-- Seed data: run AFTER migration.sql in Supabase SQL Editor
-- Populates packages and products tables from existing JSON data
-- ============================================================

-- Packages (service plans)
INSERT INTO public.packages (id, category, technologies, name, tagline, price, price_label, speed, uncapped, features, demand_range)
VALUES
  ('int-10', 'internet', '{fibre,fixed-wireless}', 'Home Lite', 'Browsing, email and SD streaming', 399, '/ month', '10 Mbps', true, '{Uncapped data,Fixed Wireless / Fibre ready,Basic Wi-Fi router,Email support}', '{1,15}'),
  ('int-25', 'internet', '{fibre,fixed-wireless}', 'Home Plus', 'HD streaming, remote work and smart home', 599, '/ month', '25 Mbps', true, '{Uncapped data,Fibre or Fixed Wireless,Dual-band Wi-Fi 6 router,Priority support}', '{10,40}'),
  ('int-50', 'internet', '{fibre}', 'Business Pro', 'Small offices, multiple users and VoIP', 899, '/ month', '50 Mbps', true, '{Uncapped data,Symmetric on Fibre,Business-grade SLA,VoIP ready}', '{30,80}'),
  ('int-100', 'internet', '{fibre}', 'Business Premium', 'High-performance branch connectivity', 1299, '/ month', '100 Mbps', true, '{Uncapped data,99.95% uptime SLA,Static IP option,24/7 NOC support}', '{70,150}'),
  ('int-200', 'internet', '{fibre}', 'Enterprise Fibre', 'Dedicated throughput for demanding sites', 1699, '/ month', '200 Mbps', true, '{Uncapped data,Dedicated Fibre,Multiple static IPs,Premium SLA & monitoring}', '{140,200}'),
  ('lte-25', 'internet', '{lte}', 'Telkom LTE 25GB', 'Mobile LTE for homes outside fibre zones', 299, '/ month', 'Up to 10 Mbps', false, '{25 GB anytime data,Telkom LTE network,LTE router included,Top-up bundles available}', '{1,20}'),
  ('lte-50', 'internet', '{lte}', 'Telkom LTE 50GB', 'More data for remote work and streaming', 499, '/ month', 'Up to 10 Mbps', false, '{50 GB anytime data,Telkom LTE network,LTE router included,Top-up bundles available}', '{10,40}'),
  ('lte-100', 'internet', '{lte}', 'Telkom LTE 100GB', 'High-capacity LTE for heavy usage', 799, '/ month', 'Up to 10 Mbps', false, '{100 GB anytime data,Telkom LTE network,LTE router included,Top-up bundles available}', '{30,80}'),
  ('glo-mpls', 'global', '{mpls}', 'MPLS VPN', 'Private, secure branch-to-branch networks', 2999, 'starting / month', NULL, false, '{Layer 3 VPN,QoS prioritisation,Multi-branch KZN + regional,Managed CPE}', '{1,5}'),
  ('glo-sdwan', 'global', '{sd-wan}', 'SD-WAN', 'Intelligent, resilient WAN orchestration', 4999, 'starting / month', NULL, false, '{Application-aware routing,Multi-link aggregation,Centralised policy,Rapid deployment}', '{3,20}'),
  ('glo-iepl', 'global', '{iepl}', 'IEPL', 'International Ethernet Private Line', 0, 'custom quote', NULL, false, '{Point-to-point global connectivity,Low latency,Guaranteed bandwidth,Sub-Saharan routes}', '{1,3}'),
  ('voi-pbx', 'voice', '{cloud-pbx}', 'Cloud PBX', 'Scalable business phone system', 299, 'per user / month', NULL, false, '{Unlimited extension calling,Voicemail-to-email,Mobile & desktop apps,Call routing & IVR}', '{2,50}'),
  ('voi-sms', 'voice', '{a2p-sms}', 'A2P SMS', 'Bulk application-to-person messaging', 0.035, 'per SMS', NULL, false, '{High delivery rate,API & portal access,Bundles from 1 000 to 50 000,Two-way SMS capable}', '{10,100}'),
  ('voi-trunk', 'voice', '{sip-trunk}', 'SIP Trunk', 'Cost-effective voice channels', 249, 'per channel / month', NULL, false, '{Per-channel billing,G.711 / G.729 codecs,DID numbers,PBX integration}', '{20,100}'),
  ('sol-3kw', 'solar', '{solar}', '3 kW Backup System', 'Essential power backup for homes and SOHO', 59990, 'installed (from)', NULL, false, '{3 kVA inverter,Lithium battery ready,Solar panels,Remote monitoring}', '{1,3}'),
  ('sol-5kw', 'solar', '{solar}', '5 kW Hybrid Solar', 'Whole-home or small office independence', 89990, 'installed (from)', NULL, false, '{5 kVA hybrid inverter,Lithium battery pack,Roof / ground mount,Grid-tie ready}', '{3,5}'),
  ('sol-8kw', 'solar', '{solar}', '8 kW Commercial Solar', 'Reliable power for sites & enterprise', 149990, 'installed (from)', NULL, false, '{8 kVA three-phase inverter,Scalable battery storage,COC & warranty included,Optional monitoring}', '{5,10}')
ON CONFLICT (id) DO NOTHING;

-- Coverage Areas (major South African cities and provinces)
INSERT INTO public.coverage_areas (city, area, technologies, package_ids, is_active)
VALUES
  -- KwaZulu-Natal
  ('Durban', 'Central Business District', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Durban', 'Umhlanga', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Durban', 'Westville', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Durban', 'Berea', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Pietermaritzburg', 'Central', '{fibre,fixed-wireless,lte}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Pietermaritzburg', 'Northdale', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  ('Newcastle', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Pinetown', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Ballito', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Hillcrest', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Kloof', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  -- Gauteng
  ('Johannesburg', 'Sandton', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Johannesburg', 'Midrand', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Johannesburg', 'Rosebank', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Johannesburg', 'Soweto', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  ('Pretoria', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Pretoria', 'Menlyn', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Centurion', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  -- Western Cape
  ('Cape Town', 'Central Business District', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Cape Town', 'Sandton', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Cape Town', 'Camps Bay', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Stellenbosch', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('Paarl', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- Eastern Cape
  ('Port Elizabeth', 'Central', '{fibre,fixed-wireless}', '{int-10,int-25,int-50,int-100,int-200,lte-25,lte-50,lte-100,glo-mpls,glo-sdwan,glo-iepl,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw,sol-8kw}', true),
  ('East London', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- Limpopo
  ('Polokwane', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- Mpumalanga
  ('Nelspruit', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- North West
  ('Rustenburg', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- Free State
  ('Bloemfontein', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw,sol-5kw}', true),
  -- Northern Cape
  ('Kimberley', 'Central', '{fixed-wireless,lte}', '{int-10,int-25,lte-25,lte-50,lte-100,voi-pbx,voi-sms,voi-trunk,sol-3kw}', true)
ON CONFLICT (city, area) DO NOTHING;

-- Products (phones & equipment)
INSERT INTO public.products (id, slug, category, name, brand, model, color, color_code, price, compare_at_price, stock, image, description, specs)
VALUES
  ('iiif150-a5pro-black', 'iiif150-action-a5pro-rugged-smartphone-black', 'phone', 'IIIF150 Action A5Pro Rugged Smartphone – Black', 'IIIF150', 'Action A5Pro', 'Black', '#1F2937', 2699, 2999, 12, '/images/phones/black.webp', 'Rugged 6.88" HD+ smartphone with dual-screen design, 3GB RAM + 256GB ROM, 5100mAh battery and Android 15.', '{"Display":"6.88\" HD+ HAA Display","Rear Camera":"16MP + QVGA","Front Camera":"5MP","RAM & ROM":"8GB (3GB + 5GB Extended) + 256GB","Battery":"5100mAh","OS":"Android 15 GO","Weight":"207g"}'),
  ('iiif150-a5pro-purple', 'iiif150-action-a5pro-rugged-smartphone-purple', 'phone', 'IIIF150 Action A5Pro Rugged Smartphone – Purple', 'IIIF150', 'Action A5Pro', 'Purple', '#7C3AED', 2699, 2999, 8, '/images/phones/purple.webp', 'Rugged 6.88" HD+ smartphone with dual-screen design, 3GB RAM + 256GB ROM, 5100mAh battery and Android 15.', '{"Display":"6.88\" HD+ HAA Display","Rear Camera":"16MP + QVGA","Front Camera":"5MP","RAM & ROM":"8GB (3GB + 5GB Extended) + 256GB","Battery":"5100mAh","OS":"Android 15 GO","Weight":"207g"}'),
  ('iiif150-a5pro-titanium', 'iiif150-action-a5pro-rugged-smartphone-titanium', 'phone', 'IIIF150 Action A5Pro Rugged Smartphone – Titanium', 'IIIF150', 'Action A5Pro', 'Titanium', '#9CA3AF', 2699, 2999, 5, '/images/phones/titanium.webp', 'Rugged 6.88" HD+ smartphone with dual-screen design, 3GB RAM + 256GB ROM, 5100mAh battery and Android 15.', '{"Display":"6.88\" HD+ HAA Display","Rear Camera":"16MP + QVGA","Front Camera":"5MP","RAM & ROM":"8GB (3GB + 5GB Extended) + 256GB","Battery":"5100mAh","OS":"Android 15 GO","Weight":"207g"}'),
  ('cdata-fd511g', 'cdata-fd511g-xpon-onu', 'equipment', 'C-DATA FD511G XPON ONU (No WiFi)', 'C-DATA', 'FD511G-F660', 'White', '#F1F5F9', 450, NULL, 40, '/images/equipment/fd511g.webp', 'Indoor 1GE XPON ONU with GPON/EPON adaptive optical port. Compatible with C-DATA and mainstream (Huawei/ZTE/Fiberhome) OLTs.', '{"Specification":"1*xPON + 1*GE RJ45","PON Mode":"GPON / EPON adaptive","GPON Rate":"2.488Gbps / 1.244Gbps downstream/upstream","EPON Rate":"1.25Gbps downstream/upstream","LAN Port":"1x 10/100/1000Mbps RJ45","WiFi":"None","Power":"External 12V/0.5A DC adapter"}'),
  ('cdata-fd514gs1', 'cdata-fd514gs1-xpon-onu-wifi6', 'equipment', 'C-DATA FD514GS1 XPON ONU WiFi6 (AX1500)', 'C-DATA', 'FD514GS1-R550', 'White', '#F1F5F9', 950, NULL, 25, '/images/equipment/fd514gs1.webp', 'WiFi6 xPON Gateway ONT supporting 802.11a/b/g/n/ac/ax over 2.4GHz and 5GHz with speeds up to 1500Mbps.', '{"Specification":"1*xPON + 4*GE RJ45","PON Mode":"GPON / EPON adaptive","WiFi":"Dual-Band WiFi6 (AX1500)","Antennas":"4x External 5dBi","LAN Ports":"4x 10/100/1000Mbps RJ45","Power":"External 12V/2A DC adapter"}'),
  ('cdata-fd1701s', 'cdata-fd1701s-mini-gpon-olt', 'equipment', 'C-DATA FD1701S Mini 1-Port GPON OLT', 'C-DATA', 'FD1701S', 'Purple/Black', '#6D28D9', 8500, NULL, 6, '/images/equipment/fd1700s.webp', 'Modular 1RU GPON OLT chassis fitted with a single 1-port GPON service card. Supports up to 128 ONU connections with 1:128 splitting ratio.', '{"PON Ports":"1x GPON","Uplink Port":"4*1G(SFP)/10G SFP+ or 4*10G(SFP+)/25G(SFP28)","Splitting Ratio":"1:128","Max ONUs":"Up to 128","Standard":"ITU-T G.984.x, FSAN Class B+/C+","Form Factor":"1RU chassis"}'),
  ('cdata-fd1708s', 'cdata-fd1708s-8-port-gpon-olt', 'equipment', 'C-DATA FD1708S 8-Port GPON OLT', 'C-DATA', 'FD1708S', 'Purple/Black', '#6D28D9', 18500, NULL, 4, '/images/equipment/fd1700s.webp', '1RU modular GPON OLT chassis fitted with an 8-port GPON service card. Supports up to 1024 ONU connections with 1:128 splitting ratio per port.', '{"PON Ports":"8x GPON","Uplink Port":"4*1G(SFP)/10G SFP+ or 4*10G(SFP+)/25G(SFP28)","Splitting Ratio":"1:128 per port","Max ONUs":"Up to 1024","Standard":"ITU-T G.984.x, FSAN Class B+/C+","Form Factor":"1RU chassis"}'),
  ('cdata-fd1716s', 'cdata-fd1716s-16-port-gpon-olt', 'equipment', 'C-DATA FD1716S 16-Port GPON OLT', 'C-DATA', 'FD1716S', 'Purple/Black', '#6D28D9', 32000, NULL, 3, '/images/equipment/fd1700s.webp', '1RU modular GPON OLT chassis fitted with a 16-port GPON service card. Supports up to 2048 ONU connections with 1:128 splitting ratio per port.', '{"PON Ports":"16x GPON","Uplink Port":"4*1G(SFP)/10G SFP+ or 4*10G(SFP+)/25G(SFP28)","Splitting Ratio":"1:128 per port","Max ONUs":"Up to 2048","Standard":"ITU-T G.984.x, FSAN Class B+/C+","Form Factor":"1RU chassis"}')
ON CONFLICT (id) DO NOTHING;
