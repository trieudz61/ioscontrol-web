// IOSControl API Documentation Data — EN/VI

// ═══════════════════════════════════════════
// Getting Started Guide
// ═══════════════════════════════════════════
const GUIDE_SECTIONS = [
  {
    id: "about",
    title: { en: "What is IOSControl?", vi: "IOSControl là gì?" },
    icon: '<i data-lucide="info" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p><strong>IOSControl</strong> is a complete iOS automation framework for jailbroken iPhones (iOS 13-15). It provides:</p>
<ul>
  <li><strong>Native touch injection</strong> — tap, swipe, pinch, rotate via IOHIDEvent (system-level, works in any app)</li>
  <li><strong>Lua scripting engine</strong> — write and execute automation scripts with 65+ built-in functions</li>
  <li><strong>Web IDE</strong> — full-featured code editor accessible from any browser on your network</li>
  <li><strong>Image & OCR matching</strong> — find images and text on screen, then interact automatically</li>
  <li><strong>Network control</strong> — toggle airplane mode, cellular data, get public IP for IP rotation</li>
  <li><strong>Stats overlay</strong> — transparent on-screen HUD showing automation statistics</li>
  <li><strong>Volume button trigger</strong> — start/stop scripts with hardware buttons from any screen</li>
  <li><strong>REST API</strong> — control everything remotely via HTTP endpoints</li>
</ul>
<div class="guide-note">
  <strong>Compatibility:</strong> Requires jailbroken iPhone running iOS 13-15 (Dopamine/TrollStore/Checkra1n).
  IOSControl runs as a system daemon — it works across all apps without needing to open any app.
</div>`,
      vi: `<p><strong>IOSControl</strong> là framework tự động hoá iOS hoàn chỉnh cho iPhone jailbreak (iOS 13-15). Cung cấp:</p>
<ul>
  <li><strong>Touch injection native</strong> — tap, swipe, pinch, rotate qua IOHIDEvent (hệ thống, hoạt động mọi app)</li>
  <li><strong>Engine Lua</strong> — viết và chạy script tự động với 65+ hàm built-in</li>
  <li><strong>Web IDE</strong> — trình soạn thảo code đầy đủ, truy cập từ trình duyệt trong mạng</li>
  <li><strong>Nhận diện hình & OCR</strong> — tìm hình và chữ trên màn hình, tương tác tự động</li>
  <li><strong>Điều khiển mạng</strong> — bật/tắt chế độ máy bay, 4G, lấy IP public để đổi IP</li>
  <li><strong>Bảng thống kê</strong> — HUD trong suốt hiển thị thống kê trên màn hình</li>
  <li><strong>Trigger nút âm lượng</strong> — bắt đầu/dừng script bằng nút vật lý từ bất kỳ màn hình nào</li>
  <li><strong>REST API</strong> — điều khiển mọi thứ từ xa qua HTTP</li>
</ul>
<div class="guide-note">
  <strong>Tương thích:</strong> Yêu cầu iPhone jailbreak chạy iOS 13-15 (Dopamine/TrollStore/Checkra1n).
  IOSControl chạy dưới dạng daemon hệ thống — hoạt động xuyên suốt tất cả app mà không cần mở app nào.
</div>`,
    },
  },
  {
    id: "install",
    title: { en: "How to install?", vi: "Cách cài đặt?" },
    icon: '<i data-lucide="download" style="width:16px;height:16px;"></i>',
    content: {
      en: `<ol>
  <li><strong>Open Sileo</strong> on your jailbroken device</li>
  <li><strong>Add our repo</strong> — Go to <em>Sources</em> → <em>Edit</em> → <em>Add</em> and enter:
    <div class="guide-code">https://ioscontrol.com/repo</div>
  </li>
  <li><strong>Search &amp; Install</strong> — Search for <strong>IOSControl</strong> in Sileo and tap <em>Install</em></li>
  <li><strong>Respring</strong> — Sileo will prompt you to respring. After respring, IOSControl is active.</li>
  <li><strong>Access Web IDE</strong> from your computer browser:
    <div class="guide-code">http://device-ip:9999</div>
  </li>
</ol>
<div class="guide-note">
  <strong>What gets installed:</strong> SpringBoard tweak (touch injection + volume trigger), iControlHelper daemon (Lua engine + HTTP server + Web IDE), TrollVNC (screen mirroring), and the iControlApp (native iOS app).
</div>`,
      vi: `<ol>
  <li><strong>Mở Sileo</strong> trên thiết bị đã jailbreak</li>
  <li><strong>Thêm repo</strong> — Vào <em>Sources</em> → <em>Edit</em> → <em>Add</em> và nhập:
    <div class="guide-code">https://ioscontrol.com/repo</div>
  </li>
  <li><strong>Tìm &amp; Cài đặt</strong> — Tìm <strong>IOSControl</strong> trong Sileo và bấm <em>Install</em></li>
  <li><strong>Respring</strong> — Sileo sẽ yêu cầu respring. Sau respring, IOSControl đã hoạt động.</li>
  <li><strong>Truy cập Web IDE</strong> từ trình duyệt trên máy tính:
    <div class="guide-code">http://device-ip:9999</div>
  </li>
</ol>
<div class="guide-note">
  <strong>Được cài đặt:</strong> SpringBoard tweak (touch injection + trigger nút âm lượng), iControlHelper daemon (Lua engine + HTTP server + Web IDE), TrollVNC (phản chiếu màn hình), và iControlApp (ứng dụng native iOS).
</div>`,
    },
  },
  {
    id: "volume-trigger",
    title: {
      en: "How to use Volume Button Trigger?",
      vi: "Cách dùng trigger nút âm lượng?",
    },
    icon: '<i data-lucide="volume-2" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>IOSControl hooks into the system volume buttons for instant script control from <strong>any screen</strong>:</p>
<table class="guide-table">
  <thead><tr><th>Action</th><th>Function</th></tr></thead>
  <tbody>
    <tr><td><strong>Volume Down — press 2 times quickly</strong></td><td><i data-lucide="play" style="width:14px;height:14px;vertical-align:-2px;"></i> Run the selected script (or last script)</td></tr>
    <tr><td><strong>Volume Down — hold 2 seconds</strong></td><td><i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Stop the running script</td></tr>
    <tr><td><strong>Volume Up — press 2 times quickly</strong></td><td><i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Stop recording (if recording)</td></tr>
  </tbody>
</table>
<div class="guide-note">
  <strong>How it works:</strong> IOSControl uses low-level <code>IOHIDEvent</code> keyboard hooks (Consumer Page 0x0C, Usage 0xEA/0xE9) in SpringBoard to capture volume button events system-wide. This works even when the screen is locked or another app is in the foreground.
</div>`,
      vi: `<p>IOSControl hook vào nút âm lượng hệ thống để điều khiển script từ <strong>bất kỳ màn hình nào</strong>:</p>
<table class="guide-table">
  <thead><tr><th>Thao tác</th><th>Chức năng</th></tr></thead>
  <tbody>
    <tr><td><strong>Volume Down — bấm nhanh 2 lần</strong></td><td><i data-lucide="play" style="width:14px;height:14px;vertical-align:-2px;"></i> Chạy script đã chọn (hoặc script cuối)</td></tr>
    <tr><td><strong>Volume Down — giữ 2 giây</strong></td><td><i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Dừng script đang chạy</td></tr>
    <tr><td><strong>Volume Up — bấm nhanh 2 lần</strong></td><td><i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Dừng ghi (nếu đang ghi)</td></tr>
  </tbody>
</table>
<div class="guide-note">
  <strong>Cách hoạt động:</strong> IOSControl sử dụng <code>IOHIDEvent</code> keyboard hook cấp thấp (Consumer Page 0x0C, Usage 0xEA/0xE9) trong SpringBoard để bắt sự kiện nút âm lượng toàn hệ thống. Hoạt động ngay cả khi màn hình khoá hoặc đang ở app khác.
</div>`,
    },
  },
  {
    id: "web-ide",
    title: { en: "How to use the Web IDE?", vi: "Cách dùng Web IDE?" },
    icon: '<i data-lucide="code" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>The Web IDE is a full-featured code editor that runs in your browser:</p>
<ol>
  <li><strong>Open browser</strong> and go to <code>http://device-ip:9999/ide</code></li>
  <li><strong>IDE has 5 tabs</strong>:
    <ul>
      <li><i data-lucide="file-edit" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Editor</strong> — Write and edit Lua scripts with syntax highlighting</li>
      <li><i data-lucide="folder" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Files</strong> — Manage scripts (.lua) and data files (.txt)</li>
      <li><i data-lucide="image" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Images</strong> — View and manage screenshots & reference images</li>
      <li><i data-lucide="book-open" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Functions</strong> — Browse all 65+ functions with examples (click to insert)</li>
      <li><i data-lucide="terminal" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Console</strong> — Real-time log output from running scripts</li>
    </ul>
  </li>
  <li><strong>Run scripts</strong> — Click the <i data-lucide="play" style="width:14px;height:14px;vertical-align:-2px;"></i> Play button or press <code>Ctrl+Enter</code></li>
  <li><strong>Stop scripts</strong> — Click the <i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Stop button</li>
  <li><strong>Autocomplete</strong> — Type function names and press Tab for auto-completion</li>
</ol>
<div class="guide-note">
  <strong>Live Screen:</strong> The IDE includes a live VNC screen viewer on the right panel. You can see your device screen in real-time and click to get coordinates.
</div>`,
      vi: `<p>Web IDE là trình soạn thảo code đầy đủ chạy trên trình duyệt:</p>
<ol>
  <li><strong>Mở trình duyệt</strong> và vào <code>http://device-ip:9999/ide</code></li>
  <li><strong>IDE có 5 tab</strong>:
    <ul>
      <li><i data-lucide="file-edit" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Editor</strong> — Viết và chỉnh sửa Lua script với syntax highlighting</li>
      <li><i data-lucide="folder" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Files</strong> — Quản lý script (.lua) và file dữ liệu (.txt)</li>
      <li><i data-lucide="image" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Images</strong> — Xem và quản lý ảnh chụp màn hình & ảnh tham chiếu</li>
      <li><i data-lucide="book-open" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Functions</strong> — Duyệt 65+ hàm với ví dụ (bấm để chèn)</li>
      <li><i data-lucide="terminal" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"></i> <strong>Console</strong> — Log real-time từ script đang chạy</li>
    </ul>
  </li>
  <li><strong>Chạy script</strong> — Bấm nút <i data-lucide="play" style="width:14px;height:14px;vertical-align:-2px;"></i> Play hoặc <code>Ctrl+Enter</code></li>
  <li><strong>Dừng script</strong> — Bấm nút <i data-lucide="square" style="width:14px;height:14px;vertical-align:-2px;"></i> Stop</li>
  <li><strong>Autocomplete</strong> — Gõ tên hàm rồi bấm Tab để tự động hoàn thành</li>
</ol>
<div class="guide-note">
  <strong>Màn hình live:</strong> IDE tích hợp VNC viewer ở panel phải. Bạn có thể xem màn hình thiết bị real-time và click để lấy toạ độ.
</div>`,
    },
  },
  {
    id: "write-script",
    title: { en: "How to write a script?", vi: "Cách viết script?" },
    icon: '<i data-lucide="file-text" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>IOSControl uses <strong>Lua 5.4</strong> as the scripting language with 65+ extended functions:</p>
<div class="guide-code">-- Example: Auto-login script
tapText("Login")              -- Find "Login" text and tap it
sleep(2)                       -- Wait 2 seconds
inputText("myuser@email.com")  -- Type email
tap(200, 500)                  -- Tap password field
inputText("mypassword")        -- Type password
tapText("Sign In")             -- Tap sign-in button

-- Loop with stats overlay
showOverlay({["Runs"] = "0", ["OK"] = "0"})
for i = 1, 100 do
  updateOverlay("Runs", i)
  -- ... automation logic ...
end
hideOverlay()</div>
<p><strong>Key concepts:</strong></p>
<ul>
  <li>Scripts are <code>.lua</code> files stored in <code>/var/mobile/Library/IOSControl/Scripts/</code></li>
  <li>Use <code>sleep(seconds)</code> to wait between actions</li>
  <li>Use <code>log("message")</code> to print to console</li>
  <li>Use <code>readFile</code> / <code>writeFile</code> / <code>appendFile</code> for file I/O</li>
  <li>All coordinates are in WDA points (screen pixels / scale factor)</li>
</ul>`,
      vi: `<p>IOSControl sử dụng <strong>Lua 5.4</strong> làm ngôn ngữ scripting với 65+ hàm mở rộng:</p>
<div class="guide-code">-- Ví dụ: Script tự động đăng nhập
tapText("Login")              -- Tìm chữ "Login" và chạm
sleep(2)                       -- Chờ 2 giây
inputText("myuser@email.com")  -- Gõ email
tap(200, 500)                  -- Chạm vào ô mật khẩu
inputText("mypassword")        -- Gõ mật khẩu
tapText("Sign In")             -- Chạm nút đăng nhập

-- Vòng lặp với bảng thống kê
showOverlay({["Runs"] = "0", ["OK"] = "0"})
for i = 1, 100 do
  updateOverlay("Runs", i)
  -- ... logic tự động ...
end
hideOverlay()</div>
<p><strong>Khái niệm chính:</strong></p>
<ul>
  <li>Script là file <code>.lua</code> lưu tại <code>/var/mobile/Library/IOSControl/Scripts/</code></li>
  <li>Dùng <code>sleep(giây)</code> để chờ giữa các thao tác</li>
  <li>Dùng <code>log("thông báo")</code> để in ra console</li>
  <li>Dùng <code>readFile</code> / <code>writeFile</code> / <code>appendFile</code> cho file I/O</li>
  <li>Tất cả toạ độ tính theo WDA points (pixel màn hình / scale factor)</li>
</ul>`,
    },
  },
  {
    id: "record",
    title: { en: "How to record actions?", vi: "Cách ghi lại thao tác?" },
    icon: '<i data-lucide="circle-dot" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>IOSControl can record your touch interactions and save them as replayable Lua scripts:</p>
<ol>
  <li><strong>Start recording</strong> — Use the Web IDE's Record button, or call <code>recordStart()</code> in a script</li>
  <li><strong>Interact normally</strong> — All your taps, swipes, and gestures will be captured with precise timing</li>
  <li><strong>Stop recording</strong> — Press Volume Up ×2, or use the IDE's Stop button</li>
  <li><strong>Script is saved</strong> — A new .lua file appears in the Files tab with recorded actions</li>
  <li><strong>Replay</strong> — Open the recorded script and press Play to replay your actions</li>
</ol>
<div class="guide-code">-- Recorded script example (auto-generated):
tap(165, 432)
sleep(0.8)
swipe(200, 600, 200, 200, 0.3)
sleep(1.2)
tap(310, 275)</div>
<div class="guide-note">
  <strong>Tip:</strong> You can edit the recorded script to fine-tune timing, add loops, or insert smart functions like <code>tapImage</code> and <code>waitForText</code>.
</div>`,
      vi: `<p>IOSControl có thể ghi lại thao tác chạm và lưu thành Lua script có thể phát lại:</p>
<ol>
  <li><strong>Bắt đầu ghi</strong> — Dùng nút Record trên Web IDE, hoặc gọi <code>recordStart()</code> trong script</li>
  <li><strong>Tương tác bình thường</strong> — Mọi chạm, vuốt, cử chỉ sẽ được ghi lại với timing chính xác</li>
  <li><strong>Dừng ghi</strong> — Bấm Volume Up ×2, hoặc dùng nút Stop trên IDE</li>
  <li><strong>Script được lưu</strong> — File .lua mới xuất hiện trong tab Files</li>
  <li><strong>Phát lại</strong> — Mở script đã ghi và bấm Play để phát lại</li>
</ol>
<div class="guide-code">-- Ví dụ script đã ghi (tự động tạo):
tap(165, 432)
sleep(0.8)
swipe(200, 600, 200, 200, 0.3)
sleep(1.2)
tap(310, 275)</div>
<div class="guide-note">
  <strong>Mẹo:</strong> Bạn có thể sửa script đã ghi để tinh chỉnh timing, thêm vòng lặp, hoặc chèn hàm thông minh như <code>tapImage</code> và <code>waitForText</code>.
</div>`,
    },
  },
  {
    id: "screenshot",
    title: {
      en: "How to use screenshots?",
      vi: "Cách dùng ảnh chụp màn hình?",
    },
    icon: '<i data-lucide="camera" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>Screenshots are essential for image matching (<code>findImage</code>, <code>tapImage</code>) and color detection:</p>
<ol>
  <li><strong>Take screenshot</strong> — Use <code>screenshot("screen.png")</code> in script, or use iOS native screenshot</li>
  <li><strong>Screenshots are saved</strong> as JPEG in <code>/var/mobile/Library/IOSControl/images/</code></li>
  <li><strong>View in IDE</strong> — Go to the Images tab to see all saved screenshots</li>
  <li><strong>Crop reference images</strong> — Cut out buttons, icons, or UI elements to use with <code>tapImage</code></li>
  <li><strong>Upload images</strong> — Drag and drop images into the IDE's Images tab</li>
</ol>
<div class="guide-code">-- Screenshot with region crop
screenshot("full.png")                      -- Full screen
screenshot("button.png", {100, 200, 50, 50}) -- Region: x, y, width, height

-- Use for automation
tapImage("button.png")                      -- Find and tap that button
local ok = findImage("icon.png", 1, 0.9)   -- Search with 90% match</div>`,
      vi: `<p>Ảnh chụp màn hình cần thiết cho nhận diện hình (<code>findImage</code>, <code>tapImage</code>) và phát hiện màu:</p>
<ol>
  <li><strong>Chụp ảnh</strong> — Dùng <code>screenshot("screen.png")</code> trong script, hoặc chụp native iOS</li>
  <li><strong>Ảnh được lưu</strong> dạng JPEG tại <code>/var/mobile/Library/IOSControl/images/</code></li>
  <li><strong>Xem trên IDE</strong> — Vào tab Images để xem tất cả ảnh đã lưu</li>
  <li><strong>Cắt ảnh tham chiếu</strong> — Cắt các nút, icon, UI element để dùng với <code>tapImage</code></li>
  <li><strong>Upload ảnh</strong> — Kéo thả ảnh vào tab Images của IDE</li>
</ol>
<div class="guide-code">-- Chụp màn hình với vùng crop
screenshot("full.png")                      -- Toàn màn hình
screenshot("button.png", {100, 200, 50, 50}) -- Vùng: x, y, width, height

-- Dùng cho tự động hoá
tapImage("button.png")                      -- Tìm và chạm nút đó
local ok = findImage("icon.png", 1, 0.9)   -- Tìm với 90% match</div>`,
    },
  },
  {
    id: "rest-api",
    title: {
      en: "How to control remotely via API?",
      vi: "Cách điều khiển từ xa qua API?",
    },
    icon: '<i data-lucide="globe" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>IOSControl exposes a full REST API on port <strong>9999</strong> for remote control:</p>
<div class="guide-code"># Run a script
curl -X POST http://device-ip:9999/api/scripts/run \\
  -H "Content-Type: application/json" \\
  -d '{"code": "tap(200, 400)\\nsleep(1)\\nlog(\\"done\\")"}'

# List scripts
curl http://device-ip:9999/api/scripts/files

# Get running status
curl http://device-ip:9999/api/scripts/running

# Take screenshot
curl http://device-ip:9999/api/screenshot -o screen.jpg

# Single tap
curl -X POST http://device-ip:9999/api/touch \\
  -d '{"action":"tap","x":200,"y":400}'</div>
<div class="guide-note">
  <strong>WebSocket:</strong> Connect to <code>ws://device-ip:9999/ws</code> for real-time log streaming and script status updates.
</div>`,
      vi: `<p>IOSControl cung cấp REST API đầy đủ trên port <strong>9999</strong> để điều khiển từ xa:</p>
<div class="guide-code"># Chạy script
curl -X POST http://device-ip:9999/api/scripts/run \\
  -H "Content-Type: application/json" \\
  -d '{"code": "tap(200, 400)\\nsleep(1)\\nlog(\\"done\\")"}'

# Liệt kê script
curl http://device-ip:9999/api/scripts/files

# Xem trạng thái đang chạy
curl http://device-ip:9999/api/scripts/running

# Chụp ảnh màn hình
curl http://device-ip:9999/api/screenshot -o screen.jpg

# Tap đơn
curl -X POST http://device-ip:9999/api/touch \\
  -d '{"action":"tap","x":200,"y":400}'</div>
<div class="guide-note">
  <strong>WebSocket:</strong> Kết nối tới <code>ws://device-ip:9999/ws</code> để nhận log real-time và cập nhật trạng thái script.
</div>`,
    },
  },
  {
    id: "spoof",
    title: {
      en: "How to spoof device identity?",
      vi: "Cách fake thông tin thiết bị?",
    },
    icon: '<i data-lucide="smartphone" style="width:16px;height:16px;"></i>',
    content: {
      en: `<p>IOSControl includes a powerful <strong>Device Identity Spoof</strong> feature that lets you fake your device info per-app:</p>
<ol>
  <li><strong>Open iControlApp</strong> → go to the <strong>Spoof</strong> tab</li>
  <li><strong>Select target app</strong> from the installed apps list</li>
  <li><strong>Pick an iPhone model</strong> (30+ models: iPhone 8 → iPhone 16 Pro Max)</li>
  <li><strong>iOS version</strong> is auto-generated based on the selected model</li>
  <li><strong>Tap "Fake"</strong> → the app restarts with the new identity</li>
  <li><strong>Open the app</strong> — it now sees the spoofed device info</li>
  <li><strong>To restore:</strong> tap "Restore" on the same app</li>
</ol>
<div class="guide-note">
  <strong>Key features:</strong>
  <ul>
    <li>✅ <strong>Per-app</strong> — only fakes the app you choose, system stays untouched</li>
    <li>✅ <strong>No respring</strong> — works instantly, no SpringBoard restart needed</li>
    <li>✅ <strong>Full identity</strong> — model, iOS version, serial, IMEI, carrier, user agent</li>
    <li>✅ <strong>Persistent</strong> — survives app restarts until you restore</li>
    <li>✅ <strong>Batch mode</strong> — select multiple apps and fake them all at once</li>
  </ul>
</div>
<p><strong>Use cases:</strong> Multi-account management, app testing on different models, privacy protection, ban evasion.</p>
<div class="guide-note">
  <strong>⭐ Premium feature:</strong> Device Identity Spoof requires a Premium license.
</div>`,
      vi: `<p>IOSControl tích hợp tính năng <strong>Fake Thông Tin Thiết Bị</strong> mạnh mẽ, cho phép giả lập thông tin device theo từng app:</p>
<ol>
  <li><strong>Mở iControlApp</strong> → vào tab <strong>Spoof</strong></li>
  <li><strong>Chọn app mục tiêu</strong> từ danh sách các app đã cài</li>
  <li><strong>Chọn model iPhone</strong> (30+ model: iPhone 8 → iPhone 16 Pro Max)</li>
  <li><strong>Phiên bản iOS</strong> tự động sinh theo model đã chọn</li>
  <li><strong>Bấm "Fake"</strong> → app khởi động lại với identity mới</li>
  <li><strong>Mở app</strong> — giờ app sẽ thấy thông tin thiết bị giả lập</li>
  <li><strong>Để khôi phục:</strong> bấm "Restore" trên app đó</li>
</ol>
<div class="guide-note">
  <strong>Tính năng chính:</strong>
  <ul>
    <li>✅ <strong>Theo từng app</strong> — chỉ fake app bạn chọn, hệ thống không bị ảnh hưởng</li>
    <li>✅ <strong>Không cần respring</strong> — hoạt động ngay lập tức</li>
    <li>✅ <strong>Full identity</strong> — model, iOS, serial, IMEI, nhà mạng, user agent</li>
    <li>✅ <strong>Bền vững</strong> — giữ sau khi tắt/mở app cho đến khi restore</li>
    <li>✅ <strong>Batch mode</strong> — chọn nhiều app và fake cùng lúc</li>
  </ul>
</div>
<p><strong>Use cases:</strong> Quản lý đa tài khoản, test app trên nhiều model, bảo vệ quyền riêng tư, reset fingerprint.</p>
<div class="guide-note">
  <strong>⭐ Tính năng Premium:</strong> Fake Thông Tin Thiết Bị yêu cầu license Premium.
</div>`,
    },
  },
];

const API_SECTIONS = [
  {
    id: "touch",
    icon: '<i data-lucide="hand" style="width:16px;height:16px;"></i>',
    title: { en: "Touch Simulation", vi: "Mô phỏng cảm ứng" },
    desc: {
      en: "Simulate touches, swipes, pinch, rotate and other gestures on the device screen.",
      vi: "Mô phỏng chạm, vuốt, phóng to, xoay và các thao tác cảm ứng khác trên màn hình.",
    },
    apis: [
      {
        name: "tap(x, y)",
        type: "func",
        desc: { en: "Tap at coordinates", vi: "Chạm tại toạ độ" },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate (WDA points)", vi: "Toạ độ X (điểm WDA)" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate (WDA points)", vi: "Toạ độ Y (điểm WDA)" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Tap a button then wait for UI response\ntap(195, 400)\nsleep(0.3)\nc = get_color(195, 400)\nif c != 0xFFFFFF:\n    log("Button pressed successfully")',
        example:
          '-- Tap a button then wait for UI response\ntap(195, 400)\nsleep(0.3)\nlocal c = getColor(195, 400)\nif c ~= 0xFFFFFF then\n  log("Button pressed successfully")\nend',
      },

      {
        name: "touchDown(id, x, y)",
        type: "func",
        desc: {
          en: "Press finger down (multi-touch)",
          vi: "Nhấn ngón tay xuống (đa chạm)",
        },
        params: [
          {
            n: "id",
            t: "number",
            d: { en: "Finger ID (0-9)", vi: "ID ngón tay (0-9)" },
            req: true,
          },
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate", vi: "Toạ độ X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate", vi: "Toạ độ Y" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          "# Pinch-to-zoom with two fingers\ntouch_down(0, 150, 400)\ntouch_down(1, 250, 400)\nsleep(0.1)\nfor i in range(1, 11):\n    touch_move(0, 150 - i*5, 400)\n    touch_move(1, 250 + i*5, 400)\n    usleep(30000)\ntouch_up(0, 100, 400)\ntouch_up(1, 300, 400)",
        example:
          "-- Pinch-to-zoom with two fingers\ntouchDown(0, 150, 400)\ntouchDown(1, 250, 400)\nsleep(0.1)\nfor i = 1, 10 do\n  touchMove(0, 150 - i*5, 400)\n  touchMove(1, 250 + i*5, 400)\n  usleep(30000)\nend\ntouchUp(0, 100, 400)\ntouchUp(1, 300, 400)",
      },

      {
        name: "touchMove(id, x, y)",
        type: "func",
        desc: {
          en: "Move finger to new position",
          vi: "Di chuyển ngón tay đến vị trí mới",
        },
        params: [
          {
            n: "id",
            t: "number",
            d: { en: "Finger ID", vi: "ID ngón tay" },
            req: true,
          },
          { n: "x", t: "number", d: { en: "New X", vi: "X mới" }, req: true },
          { n: "y", t: "number", d: { en: "New Y", vi: "Y mới" }, req: true },
        ],
        ret: "void",
        example_py:
          "# Draw a circle gesture\nimport math\ntouch_down(0, 200, 300)\nfor angle in range(0, 361, 10):\n    rad = math.radians(angle)\n    x = 200 + 50 * math.cos(rad)\n    y = 300 + 50 * math.sin(rad)\n    touch_move(0, x, y)\n    usleep(20000)\ntouch_up(0, 200, 300)",
        example:
          "-- Draw a circle gesture\ntouchDown(0, 200, 300)\nfor angle = 0, 360, 10 do\n  local rad = math.rad(angle)\n  local x = 200 + 50 * math.cos(rad)\n  local y = 300 + 50 * math.sin(rad)\n  touchMove(0, x, y)\n  usleep(20000)\nend\ntouchUp(0, 200, 300)",
      },

      {
        name: "touchUp(id, x, y)",
        type: "func",
        desc: { en: "Release finger", vi: "Nhả ngón tay" },
        params: [
          {
            n: "id",
            t: "number",
            d: { en: "Finger ID", vi: "ID ngón tay" },
            req: true,
          },
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate", vi: "Toạ độ X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate", vi: "Toạ độ Y" },
            req: true,
          },
        ],
        ret: "void",
        example: "touchUp(0, 150, 300)",
      },

      {
        name: "swipe(x1, y1, x2, y2, duration)",
        type: "func",
        desc: {
          en: "Swipe gesture from point A to B",
          vi: "Vuốt từ điểm A đến B",
        },
        params: [
          {
            n: "x1",
            t: "number",
            d: { en: "Start X", vi: "X bắt đầu" },
            req: true,
          },
          {
            n: "y1",
            t: "number",
            d: { en: "Start Y", vi: "Y bắt đầu" },
            req: true,
          },
          {
            n: "x2",
            t: "number",
            d: { en: "End X", vi: "X kết thúc" },
            req: true,
          },
          {
            n: "y2",
            t: "number",
            d: { en: "End Y", vi: "Y kết thúc" },
            req: true,
          },
          {
            n: "duration",
            t: "number",
            d: {
              en: "Duration in seconds (default: 0.5)",
              vi: "Thời gian (giây, mặc định: 0.5)",
            },
            req: false,
          },
        ],
        ret: "void",
        example_py:
          '# Scroll through a feed 5 times\nfor i in range(1, 6):\n    swipe(200, 600, 200, 200, 0.3)\n    sleep(1.5)\n    log(f"Scrolled page {i}")',
        example:
          '-- Scroll through a feed 5 times\nfor i = 1, 5 do\n  swipe(200, 600, 200, 200, 0.3)\n  sleep(1.5)\n  log("Scrolled page " .. i)\nend',
      },

      {
        name: "longPress(x, y, duration)",
        type: "func",
        desc: { en: "Long press at coordinates", vi: "Nhấn giữ tại toạ độ" },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate", vi: "Toạ độ X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate", vi: "Toạ độ Y" },
            req: true,
          },
          {
            n: "duration",
            t: "number",
            d: { en: "Hold duration in seconds", vi: "Thời gian giữ (giây)" },
            req: false,
          },
        ],
        ret: "void",
        example_py:
          '# Long press to open context menu\nlong_press(200, 400, 1.5)\nsleep(0.5)\n# Tap "Copy" option in context menu\ntap(200, 350)',
        example:
          '-- Long press to open context menu\nlongPress(200, 400, 1.5)\nsleep(0.5)\n-- Tap "Copy" option in context menu\ntap(200, 350)',
      },

      {
        name: "pinch(x, y, scale, duration)",
        type: "func",
        desc: {
          en: "Pinch zoom in/out gesture",
          vi: "Phóng to/thu nhỏ bằng 2 ngón",
        },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "Center X", vi: "Tâm X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Center Y", vi: "Tâm Y" },
            req: true,
          },
          {
            n: "scale",
            t: "number",
            d: {
              en: "Scale factor (>1 = zoom in, <1 = zoom out)",
              vi: "Hệ số (>1 = phóng to, <1 = thu nhỏ)",
            },
            req: true,
          },
          {
            n: "duration",
            t: "number",
            d: { en: "Duration in seconds", vi: "Thời gian (giây)" },
            req: false,
          },
        ],
        ret: "void",
        example: "pinch(200, 400, 2.0, 0.5)  -- Zoom in 2x",
        tags: ["new", "exclusive"],
      },

      {
        name: "rotate(x, y, angle, duration)",
        type: "func",
        desc: {
          en: "Rotate gesture around center point",
          vi: "Xoay quanh điểm trung tâm",
        },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "Center X", vi: "Tâm X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Center Y", vi: "Tâm Y" },
            req: true,
          },
          {
            n: "angle",
            t: "number",
            d: { en: "Rotation angle in degrees", vi: "Góc xoay (độ)" },
            req: true,
          },
          {
            n: "duration",
            t: "number",
            d: { en: "Duration in seconds", vi: "Thời gian (giây)" },
            req: false,
          },
        ],
        ret: "void",
        example: "rotate(200, 400, 90, 0.5)  -- Rotate 90°",
        tags: ["new", "exclusive"],
      },
    ],
  },
  {
    id: "color",
    icon: '<i data-lucide="palette" style="width:16px;height:16px;"></i>',
    title: { en: "Color & Pixel", vi: "Màu sắc & Pixel" },
    desc: {
      en: "Read pixel colors, find color patterns, and wait for specific colors on screen.",
      vi: "Đọc màu pixel, tìm mẫu màu, và chờ màu cụ thể trên màn hình.",
    },
    apis: [
      {
        name: "getColor(x, y)",
        type: "func",
        desc: {
          en: "Get pixel color at coordinates",
          vi: "Lấy màu pixel tại toạ độ",
        },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate", vi: "Toạ độ X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate", vi: "Toạ độ Y" },
            req: true,
          },
        ],
        ret: "number — hex color (0xRRGGBB)",
        example_py:
          '# Wait for loading screen to finish\nwhile True:\n    c = get_color(200, 400)\n    if c != 0x000000:\n        log(f"Loading complete! Color: {c:#08x}")\n        break\n    sleep(0.5)\ntap(200, 400)',
        example:
          '-- Wait for loading screen to finish\nwhile true do\n  local c = getColor(200, 400)\n  if c ~= 0x000000 then\n    log("Loading complete! Color: " .. string.format("0x%06X", c))\n    break\n  end\n  sleep(0.5)\nend\ntap(200, 400)',
      },
      {
        name: "getColors(locations)",
        type: "func",
        desc: {
          en: "Get multiple pixel colors at once",
          vi: "Lấy nhiều màu pixel cùng lúc",
        },
        params: [
          {
            n: "locations",
            t: "table",
            d: { en: "Array of {x, y} pairs", vi: "Mảng các cặp {x, y}" },
            req: true,
          },
        ],
        ret: "table — array of hex colors",
        example: "local colors = getColors({{100,200}, {150,300}})",
      },
      {
        name: "findColor(color, count, region)",
        type: "func",
        desc: {
          en: "Find pixels matching a specific color",
          vi: "Tìm pixel khớp với màu chỉ định",
        },
        params: [
          {
            n: "color",
            t: "number",
            d: { en: "Target color (hex)", vi: "Màu đích (hex)" },
            req: true,
          },
          {
            n: "count",
            t: "number",
            d: { en: "Max results", vi: "Số kết quả tối đa" },
            req: false,
          },
          {
            n: "region",
            t: "table",
            d: { en: "{x, y, w, h} search area", vi: "Vùng tìm {x, y, w, h}" },
            req: false,
          },
        ],
        ret: "table — array of {x, y} matches",
        example_py:
          '# Find and tap all red buttons on screen\npts = find_color(0xFF0000, 10, [0, 0, 428, 926])\nlog(f"Found {len(pts)} red pixels")\nfor p in pts:\n    tap(p["x"], p["y"])\n    sleep(0.3)',
        example:
          '-- Find and tap all red buttons on screen\nlocal pts = findColor(0xFF0000, 10, {0, 0, 428, 926})\nlog("Found " .. #pts .. " red pixels")\nfor _, p in ipairs(pts) do\n  tap(p.x, p.y)\n  sleep(0.3)\nend',
      },
      {
        name: "findColors(params)",
        type: "func",
        desc: {
          en: "Find multi-color pattern on screen",
          vi: "Tìm mẫu nhiều màu trên màn hình",
        },
        params: [
          {
            n: "params",
            t: "table",
            d: {
              en: "Pattern definition with anchor + offsets",
              vi: "Mẫu với điểm neo + offset",
            },
            req: true,
          },
        ],
        ret: "table — match locations",
        example:
          "local r = findColors({\n  {color=0xFF0000, x=0, y=0},\n  {color=0x00FF00, x=10, y=0}\n})",
      },
      {
        name: "waitForColor(x, y, color, timeout)",
        type: "func",
        desc: {
          en: "Wait until pixel matches target color",
          vi: "Chờ cho đến khi pixel khớp màu",
        },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "X coordinate", vi: "Toạ độ X" },
            req: true,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Y coordinate", vi: "Toạ độ Y" },
            req: true,
          },
          {
            n: "color",
            t: "number",
            d: { en: "Expected color", vi: "Màu mong đợi" },
            req: true,
          },
          {
            n: "timeout",
            t: "number",
            d: { en: "Timeout in seconds", vi: "Thời gian chờ (giây)" },
            req: false,
          },
        ],
        ret: "boolean — true if matched",
        example_py:
          '# Wait for green "Ready" indicator\nok = wait_for_color(200, 300, 0x00FF00, 10)\nif ok:\n    log("Ready! Starting automation...")\n    tap(200, 500)\nelse:\n    log("Timeout waiting for ready state")',
        example:
          '-- Wait for green "Ready" indicator\nlocal ok = waitForColor(200, 300, 0x00FF00, 10)\nif ok then\n  log("Ready! Starting automation...")\n  tap(200, 500)\nelse\n  log("Timeout waiting for ready state")\nend',
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "image",
    icon: '<i data-lucide="image" style="width:16px;height:16px;"></i>',
    title: { en: "Image Recognition", vi: "Nhận dạng hình ảnh" },
    desc: {
      en: "Find images on screen with template matching, OCR text recognition.",
      vi: "Tìm hình ảnh trên màn hình bằng template matching, nhận dạng chữ OCR.",
    },
    apis: [
      {
        name: "findImage(path, count, threshold, region)",
        type: "func",
        desc: {
          en: "Find template image on device screen",
          vi: "Tìm hình ảnh mẫu trên màn hình",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "Path to template image", vi: "Đường dẫn ảnh mẫu" },
            req: true,
          },
          {
            n: "count",
            t: "number",
            d: { en: "Max matches", vi: "Số kết quả tối đa" },
            req: false,
          },
          {
            n: "threshold",
            t: "number",
            d: {
              en: "Match threshold 0-1 (default: 0.8)",
              vi: "Ngưỡng khớp 0-1 (mặc định: 0.8)",
            },
            req: false,
          },
          {
            n: "region",
            t: "table",
            d: {
              en: "{x, y, w, h} search region",
              vi: "Vùng tìm {x, y, w, h}",
            },
            req: false,
          },
        ],
        ret: "table — {x, y, score} matches",
        example_py:
          '# Find and tap the play button\nmatches = find_image("/var/mobile/Library/IOSControl/images/play_btn.png", 1, 0.9)\nif len(matches) > 0:\n    btn = matches[0]\n    log(f"Found at {btn[\"x\"]},{btn[\"y\"]} score={btn[\"score\"]}")\n    tap(btn["x"], btn["y"])\nelse:\n    log("Play button not found")',
        example:
          '-- Find and tap the play button\nlocal matches = findImage("/var/mobile/Library/IOSControl/images/play_btn.png", 1, 0.9)\nif #matches > 0 then\n  local btn = matches[1]\n  log("Found button at " .. btn.x .. "," .. btn.y .. " score=" .. btn.score)\n  tap(btn.x, btn.y)\nelse\n  log("Play button not found")\nend',
      },
      {
        name: "waitForImage(path, timeout)",
        type: "func",
        desc: {
          en: "Wait for image to appear on screen",
          vi: "Chờ hình ảnh xuất hiện trên màn hình",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "Template image path", vi: "Đường dẫn ảnh mẫu" },
            req: true,
          },
          {
            n: "timeout",
            t: "number",
            d: { en: "Timeout in seconds", vi: "Thời gian chờ (giây)" },
            req: false,
          },
        ],
        ret: "table|false — match location or false",
        example: 'local m = waitForImage("dialog.png", 15)',
        tags: ["exclusive"],
      },
      {
        name: "screenshot(name, region)",
        type: "func",
        desc: {
          en: "Take screenshot — saves as JPEG in images/ directory",
          vi: "Chụp màn hình — lưu JPEG vào thư mục images/",
        },
        params: [
          {
            n: "name",
            t: "string",
            d: {
              en: "Filename (saved to images/ dir)",
              vi: "Tên file (lưu vào thư mục images/)",
            },
            req: false,
          },
          {
            n: "region",
            t: "table",
            d: {
              en: "{x, y, w, h} capture region",
              vi: "Vùng chụp {x, y, w, h}",
            },
            req: false,
          },
        ],
        ret: "string — saved file path",
        example:
          '-- Full screen\nscreenshot("myscreen")\n\n-- Region crop\nscreenshot("crop", {200, 200, 400, 400})\n\n-- Auto timestamp name\nscreenshot()',
      },
      {
        name: "deleteScreenshot(name)",
        type: "func",
        desc: {
          en: "Delete screenshot from images/ directory",
          vi: "Xoá screenshot từ thư mục images/",
        },
        params: [
          {
            n: "name",
            t: "string",
            d: { en: "Filename to delete", vi: "Tên file cần xoá" },
            req: true,
          },
        ],
        ret: "boolean — success",
        example: 'deleteScreenshot("old_screenshot.jpg")',
        tags: ["new"],
      },
      {
        name: "convertBase64(path)",
        type: "func",
        desc: {
          en: "Convert file to base64 string (images/, scripts/)",
          vi: "Chuyển file sang chuỗi base64 (images/, scripts/)",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: {
              en: "Filename or absolute path",
              vi: "Tên file hoặc đường dẫn tuyệt đối",
            },
            req: true,
          },
        ],
        ret: "string — base64 encoded data",
        example:
          '-- Screenshot then send via HTTP\nscreenshot("capture.jpg")\nlocal b64 = convertBase64("capture.jpg")\nhttpPost("https://api.example.com/upload", {image = b64})',
        tags: ["new"],
      },
      {
        name: "ocrText(x, y, w, h)",
        type: "func",
        desc: {
          en: "Read text from screen region via OCR",
          vi: "Đọc chữ từ vùng màn hình bằng OCR",
        },
        params: [
          {
            n: "x",
            t: "number",
            d: { en: "Region X", vi: "X vùng" },
            req: false,
          },
          {
            n: "y",
            t: "number",
            d: { en: "Region Y", vi: "Y vùng" },
            req: false,
          },
          {
            n: "w",
            t: "number",
            d: {
              en: "Region width (0 = full screen)",
              vi: "Chiều rộng (0 = toàn màn hình)",
            },
            req: false,
          },
          {
            n: "h",
            t: "number",
            d: { en: "Region height", vi: "Chiều cao vùng" },
            req: false,
          },
        ],
        ret: "string — detected text",
        example_py:
          '# Read coin count from game UI\ntext = ocr_text(50, 10, 150, 40)\nimport re\nm = re.search(r"\\d+", text)\nif m:\n    coins = int(m.group())\n    log(f"Current coins: {coins}")\n    if coins >= 1000:\n        log("Enough coins! Buying upgrade...")\n        tap(300, 500)',
        example:
          '-- Read coin count from game UI\nlocal text = ocrText(50, 10, 150, 40)\nlocal coins = tonumber(text:match("%d+"))\nif coins then\n  log("Current coins: " .. coins)\n  if coins >= 1000 then\n    log("Enough coins! Buying upgrade...")\n    tap(300, 500)\n  end\nend',
      },
      {
        name: "ocrFind(text)",
        type: "func",
        desc: {
          en: "Find text location on screen using OCR",
          vi: "Tìm vị trí chữ trên màn hình bằng OCR",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to search for", vi: "Chữ cần tìm" },
            req: true,
          },
        ],
        ret: "table — {x, y, w, h} or nil",
        example_py:
          '# Auto-login: find and tap the Login button\npos = ocr_find("Login")\nif pos:\n    tap(pos["x"] + pos["w"]//2, pos["y"] + pos["h"]//2)\n    sleep(1)\n    log("Login button tapped")\nelse:\n    log("Login button not found on screen")',
        example:
          '-- Auto-login: find and tap the Login button\nlocal pos = ocrFind("Login")\nif pos then\n  tap(pos.x + pos.w/2, pos.y + pos.h/2)\n  sleep(1)\n  log("Login button tapped")\nelse\n  log("Login button not found on screen")\nend',
        tags: ["exclusive"],
      },
      {
        name: "waitForText(text, timeout)",
        type: "func",
        desc: {
          en: "Wait for text to appear on screen (OCR)",
          vi: "Chờ chữ xuất hiện trên màn hình (OCR)",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to wait for", vi: "Chữ cần chờ" },
            req: true,
          },
          {
            n: "timeout",
            t: "number",
            d: { en: "Timeout in seconds", vi: "Thời gian chờ (giây)" },
            req: false,
          },
        ],
        ret: "table|false",
        example: 'waitForText("Welcome", 10)',
        tags: ["exclusive"],
      },
      {
        name: "tapImage(path, timeout, threshold)",
        type: "func",
        desc: {
          en: "Find image on screen and tap its center",
          vi: "Tìm hình trên màn hình và chạm vào giữa",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "Image filename", vi: "Tên file ảnh" },
            req: true,
          },
          {
            n: "timeout",
            t: "number",
            d: {
              en: "Timeout seconds (default 5)",
              vi: "Thời gian chờ (mặc định 5)",
            },
            req: false,
          },
          {
            n: "threshold",
            t: "number",
            d: {
              en: "Match threshold 0-1 (default 0.8)",
              vi: "Ngưỡng khớp 0-1 (mặc định 0.8)",
            },
            req: false,
          },
        ],
        ret: "boolean, x, y",
        example:
          '-- One-liner: find and tap button\nlocal ok, x, y = tapImage("btn_ok.png")\nif ok then log("Tapped at " .. x .. "," .. y) end',
        tags: ["new", "exclusive"],
      },
      {
        name: "tapText(text, timeout)",
        type: "func",
        desc: {
          en: "Find text on screen (OCR) and tap it",
          vi: "Tìm chữ trên màn hình (OCR) và chạm vào",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to find and tap", vi: "Chữ cần tìm và chạm" },
            req: true,
          },
          {
            n: "timeout",
            t: "number",
            d: {
              en: "Timeout seconds (default 5)",
              vi: "Thời gian chờ (mặc định 5)",
            },
            req: false,
          },
        ],
        ret: "boolean, x, y",
        example:
          '-- Login flow in 3 lines\ntapText("Login")\nsleep(1)\ntapText("Continue")',
        tags: ["new", "exclusive"],
      },
      {
        name: "swipeUntilImage(path, direction, maxSwipes)",
        type: "func",
        desc: {
          en: "Swipe screen until image is found",
          vi: "Vuốt cho đến khi tìm thấy hình",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "Image to search for", vi: "Hình cần tìm" },
            req: true,
          },
          {
            n: "direction",
            t: "string",
            d: {
              en: '"up", "down", "left", "right"',
              vi: '"up", "down", "left", "right"',
            },
            req: false,
          },
          {
            n: "maxSwipes",
            t: "number",
            d: {
              en: "Maximum swipe attempts (default 10)",
              vi: "Số lần vuốt tối đa (mặc định 10)",
            },
            req: false,
          },
        ],
        ret: "boolean, swipes, x, y",
        example:
          '-- Scroll down until we see the target\nlocal ok, n = swipeUntilImage("target.png", "up", 15)\nif ok then log("Found after " .. n .. " swipes") end',
        tags: ["new", "exclusive"],
      },
      {
        name: "swipeUntilText(text, direction, maxSwipes)",
        type: "func",
        desc: {
          en: "Swipe screen until text is found (OCR)",
          vi: "Vuốt cho đến khi tìm thấy chữ (OCR)",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to search for", vi: "Chữ cần tìm" },
            req: true,
          },
          {
            n: "direction",
            t: "string",
            d: {
              en: '"up", "down", "left", "right"',
              vi: '"up", "down", "left", "right"',
            },
            req: false,
          },
          {
            n: "maxSwipes",
            t: "number",
            d: { en: "Maximum swipe attempts", vi: "Số lần vuốt tối đa" },
            req: false,
          },
        ],
        ret: "boolean, swipes, x, y",
        example:
          '-- Scroll Settings to find Wi-Fi\nlocal ok, n, x, y = swipeUntilText("Wi-Fi", "up")\nif ok then tap(x, y) end',
        tags: ["new", "exclusive"],
      },
    ],
  },
  {
    id: "interact",
    icon: '<i data-lucide="message-square" style="width:16px;height:16px;"></i>',
    title: { en: "User Interaction", vi: "Tương tác" },
    desc: {
      en: "Show dialogs for user input during script execution, hash functions, and timestamps.",
      vi: "Hiện hộp thoại nhập liệu, hàm hash, và timestamp.",
    },
    apis: [
      {
        name: "dialogInput(title, message, default)",
        type: "func",
        desc: {
          en: "Show text input dialog and wait for user response",
          vi: "Hiện hộp thoại nhập text và chờ phản hồi",
        },
        params: [
          {
            n: "title",
            t: "string",
            d: { en: "Dialog title", vi: "Tiêu đề" },
            req: false,
          },
          {
            n: "message",
            t: "string",
            d: { en: "Description text", vi: "Mô tả" },
            req: false,
          },
          {
            n: "default",
            t: "string",
            d: { en: "Default input text", vi: "Text mặc định" },
            req: false,
          },
        ],
        ret: "string|nil — user input or nil if cancelled",
        example:
          '-- Ask for login credentials at runtime\nlocal user = dialogInput("Username", "Enter your username")\nif not user then stop() end\nlocal pass = dialogInput("Password", "Enter password")\nlog("Login as: " .. user)',
        tags: ["new", "exclusive"],
      },
      {
        name: "dialogChoice(title, ...options)",
        type: "func",
        desc: {
          en: "Show choice dialog with multiple options",
          vi: "Hiện hộp thoại chọn nhiều lựa chọn",
        },
        params: [
          {
            n: "title",
            t: "string",
            d: { en: "Dialog title", vi: "Tiêu đề" },
            req: true,
          },
          {
            n: "options",
            t: "string...",
            d: {
              en: "Option strings (variable args)",
              vi: "Các lựa chọn (varargs)",
            },
            req: true,
          },
        ],
        ret: "string|nil — selected option or nil",
        example:
          '-- Let user pick script mode\nlocal mode = dialogChoice("Speed", "Fast", "Normal", "Safe")\nif mode == "Fast" then\n  log("Running in fast mode!")\nend',
        tags: ["new", "exclusive"],
      },
      {
        name: "timestamp()",
        type: "func",
        desc: {
          en: "Get current unix timestamp in milliseconds",
          vi: "Lấy timestamp unix hiện tại (mili giây)",
        },
        params: [],
        ret: "number — milliseconds since epoch",
        example:
          '-- Measure execution time\nlocal t1 = timestamp()\ntap(200, 400)\nsleep(1)\nlocal elapsed = timestamp() - t1\nlog("Took " .. elapsed .. "ms")',
        tags: ["new", "exclusive"],
      },
      {
        name: "md5(string)",
        type: "func",
        desc: {
          en: "Calculate MD5 hash of a string",
          vi: "Tính mã băm MD5 của chuỗi",
        },
        params: [
          {
            n: "string",
            t: "string",
            d: { en: "Input string", vi: "Chuỗi đầu vào" },
            req: true,
          },
        ],
        ret: "string — 32-char hex hash",
        example:
          'local hash = md5("hello")\nlog(hash)  -- "5d41402abc4b2a76b9719d911017c592"',
        tags: ["new", "exclusive"],
      },
      {
        name: "showOverlay(data)",
        type: "func",
        desc: {
          en: "Show transparent stats overlay on screen (touch passes through)",
          vi: "Hiện bảng thống kê mờ trên màn hình (chạm xuyên qua)",
        },
        params: [
          {
            n: "data",
            t: "table",
            d: {
              en: "Key-value pairs to display",
              vi: "Bảng key-value hiển thị",
            },
            req: true,
          },
        ],
        ret: "void",
        example:
          '-- Show stats overlay\nshowOverlay({\n  ["Runs"] = "0",\n  ["Success"] = "0",\n  ["Fails"] = "0"\n})\n\n-- Update during automation loop\nfor i = 1, 100 do\n  updateOverlay("Runs", i)\n  -- do automation...\n  updateOverlay("Success", success)\nend\n\nhideOverlay()',
        tags: ["new", "exclusive"],
      },
      {
        name: "updateOverlay(key, value)",
        type: "func",
        desc: {
          en: "Update a single entry in the overlay",
          vi: "Cập nhật 1 dòng trong overlay",
        },
        params: [
          {
            n: "key",
            t: "string",
            d: { en: "Stat name", vi: "Tên thống kê" },
            req: true,
          },
          {
            n: "value",
            t: "string|number",
            d: { en: "New value", vi: "Giá trị mới" },
            req: true,
          },
        ],
        ret: "void",
        example:
          'updateOverlay("Runs", 42)\nupdateOverlay("Status", "Running...")',
        tags: ["new", "exclusive"],
      },
      {
        name: "hideOverlay()",
        type: "func",
        desc: {
          en: "Remove the stats overlay from screen",
          vi: "Ẩn bảng thống kê",
        },
        params: [],
        ret: "void",
        example: "hideOverlay()",
        tags: ["new", "exclusive"],
      },
    ],
  },
  {
    id: "app",
    icon: '<i data-lucide="smartphone" style="width:16px;height:16px;"></i>',
    title: { en: "App Management", vi: "Quản lý ứng dụng" },
    desc: {
      en: "Launch, close, and manage apps on the device.",
      vi: "Mở, đóng và quản lý ứng dụng trên thiết bị.",
    },
    apis: [
      {
        name: "appRun(bundleId)",
        type: "func",
        desc: {
          en: "Launch an app by bundle ID",
          vi: "Mở ứng dụng bằng bundle ID",
        },
        params: [
          {
            n: "bundleId",
            t: "string",
            d: { en: "App bundle identifier", vi: "Bundle ID ứng dụng" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Open Safari and navigate to a URL\napp_run("com.apple.safari")\nsleep(2)\n# Tap the address bar\ntap(214, 52)\nsleep(0.5)\ninput_text("https://google.com")\nsleep(0.3)\nkey_down("return")',
        example:
          '-- Open Safari and navigate to a URL\nappRun("com.apple.safari")\nsleep(2)\n-- Tap the address bar\ntap(214, 52)\nsleep(0.5)\ninputText("https://google.com")\nsleep(0.3)\nkeyDown("return")',
      },
      {
        name: "appKill(bundleId)",
        type: "func",
        desc: {
          en: "Close/kill a running app",
          vi: "Đóng/tắt ứng dụng đang chạy",
        },
        params: [
          {
            n: "bundleId",
            t: "string",
            d: { en: "App bundle identifier", vi: "Bundle ID ứng dụng" },
            req: true,
          },
        ],
        ret: "void",
        example: 'appKill("com.apple.safari")',
      },
      {
        name: "appState(bundleId)",
        type: "func",
        desc: {
          en: "Check if an app is running",
          vi: "Kiểm tra ứng dụng có đang chạy",
        },
        params: [
          {
            n: "bundleId",
            t: "string",
            d: { en: "App bundle identifier", vi: "Bundle ID ứng dụng" },
            req: true,
          },
        ],
        ret: {
          en: "number — 0=not running, 1=background, 4=foreground",
          vi: "number — 0=không chạy, 1=nền, 4=đang hoạt động",
        },
        example_py:
          '# Restart game if it crashed\nstate = app_state("com.game.myapp")\nif state == 0:\n    log("Game not running, restarting...")\n    app_run("com.game.myapp")\n    sleep(3)\nelif state == 1:\n    log("Game in background, bringing to front")\n    app_run("com.game.myapp")\nelse:\n    log("Game is active, continuing script")',
        example:
          '-- Restart game if it crashed\nlocal state = appState("com.game.myapp")\nif state == 0 then\n  log("Game not running, restarting...")\n  appRun("com.game.myapp")\n  sleep(3)\nelseif state == 1 then\n  log("Game in background, bringing to front")\n  appRun("com.game.myapp")\nelse\n  log("Game is active, continuing script")\nend',
      },
      {
        name: "openURL(url)",
        type: "func",
        desc: { en: "Open a URL or URL scheme", vi: "Mở URL hoặc URL scheme" },
        params: [
          {
            n: "url",
            t: "string",
            d: {
              en: "URL to open (http/https or app scheme)",
              vi: "URL cần mở (http/https hoặc scheme ứng dụng)",
            },
            req: true,
          },
        ],
        ret: "void",
        example: 'openURL("https://google.com")\nopenURL("tel://123456789")',
      },
    ],
  },
  {
    id: "input",
    icon: '<i data-lucide="keyboard" style="width:16px;height:16px;"></i>',
    title: { en: "Text & Input", vi: "Nhập liệu & Bàn phím" },
    desc: {
      en: "Type text, simulate hardware key presses.",
      vi: "Nhập văn bản, mô phỏng phím cứng.",
    },
    apis: [
      {
        name: "inputText(text)",
        type: "func",
        desc: {
          en: "Type text string on device",
          vi: "Nhập chuỗi văn bản trên thiết bị",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to type", vi: "Văn bản cần nhập" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Fill a login form\ntap(200, 300)  # Tap email field\nsleep(0.3)\ninput_text("user@email.com")\nsleep(0.2)\ntap(200, 400)  # Tap password field\nsleep(0.3)\ninput_text("mypassword123")\ntap(200, 500)  # Tap login button',
        example:
          '-- Fill a login form\ntap(200, 300)  -- Tap email field\nsleep(0.3)\ninputText("user@email.com")\nsleep(0.2)\ntap(200, 400)  -- Tap password field\nsleep(0.3)\ninputText("mypassword123")\ntap(200, 500)  -- Tap login button',
      },
      {
        name: "keyDown(keyType)",
        type: "func",
        desc: { en: "Press a hardware key", vi: "Nhấn phím cứng" },
        params: [
          {
            n: "keyType",
            t: "string",
            d: {
              en: "Key name: home, volumeUp, volumeDown, power",
              vi: "Tên phím: home, volumeUp, volumeDown, power",
            },
            req: true,
          },
        ],
        ret: "void",
        example: 'keyDown("home")',
      },
      {
        name: "keyUp(keyType)",
        type: "func",
        desc: { en: "Release a hardware key", vi: "Nhả phím cứng" },
        params: [
          {
            n: "keyType",
            t: "string",
            d: { en: "Key name", vi: "Tên phím" },
            req: true,
          },
        ],
        ret: "void",
        example: 'keyUp("home")',
      },
      {
        name: "getClipboard()",
        type: "func",
        desc: {
          en: "Get clipboard text content",
          vi: "Lấy nội dung clipboard",
        },
        params: [],
        ret: "string",
        example_py:
          '# Copy text from app and log it\nlong_press(200, 300, 1.0)\nsleep(0.5)\ntap(250, 260)  # Tap "Copy" in menu\nsleep(0.3)\ntext = get_clipboard()\nlog(f"Copied: {text}")',
        example:
          '-- Copy text from app and log it\nlongPress(200, 300, 1.0)\nsleep(0.5)\ntap(250, 260)  -- Tap "Copy" in menu\nsleep(0.3)\nlocal text = getClipboard()\nlog("Copied: " .. text)',
        tags: ["exclusive"],
      },
      {
        name: "setClipboard(text)",
        type: "func",
        desc: {
          en: "Set clipboard text content",
          vi: "Đặt nội dung clipboard",
        },
        params: [
          {
            n: "text",
            t: "string",
            d: { en: "Text to set", vi: "Văn bản cần đặt" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Paste a promo code into input field\nset_clipboard("PROMO2024")\ntap(200, 300)  # Focus input\nsleep(0.3)\nlong_press(200, 300, 1.0)\nsleep(0.5)\ntap(200, 260)  # Tap "Paste"',
        example:
          '-- Paste a promo code into input field\nsetClipboard("PROMO2024")\ntap(200, 300)  -- Focus input\nsleep(0.3)\nlongPress(200, 300, 1.0)\nsleep(0.5)\ntap(200, 260)  -- Tap "Paste"',
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "ui",
    icon: '<i data-lucide="bell" style="width:16px;height:16px;"></i>',
    title: { en: "UI & Feedback", vi: "Giao diện & Phản hồi" },
    desc: {
      en: "Show toast messages, alerts, vibrate, and log output.",
      vi: "Hiện thông báo toast, alert, rung, và ghi log.",
    },
    apis: [
      {
        name: "toast(message, delay)",
        type: "func",
        desc: {
          en: "Show temporary notification on device",
          vi: "Hiện thông báo tạm thời trên thiết bị",
        },
        params: [
          {
            n: "message",
            t: "string",
            d: { en: "Message text", vi: "Nội dung thông báo" },
            req: true,
          },
          {
            n: "delay",
            t: "number",
            d: {
              en: "Display duration in seconds (default: 2)",
              vi: "Thời gian hiển thị (giây, mặc định: 2)",
            },
            req: false,
          },
        ],
        ret: "void",
        example: 'toast("Script started!", 3)',
      },
      {
        name: "alert(message)",
        type: "func",
        desc: { en: "Show alert dialog popup", vi: "Hiện hộp thoại cảnh báo" },
        params: [
          {
            n: "message",
            t: "string",
            d: { en: "Alert message", vi: "Nội dung cảnh báo" },
            req: true,
          },
        ],
        ret: "void",
        example: 'alert("Are you sure?")',
      },
      {
        name: "vibrate()",
        type: "func",
        desc: { en: "Vibrate the device", vi: "Rung thiết bị" },
        params: [],
        ret: "void",
        example: "vibrate()",
      },
      {
        name: "log(message)",
        type: "func",
        desc: { en: "Log message to console", vi: "Ghi log ra console" },
        params: [
          {
            n: "message",
            t: "string",
            d: { en: "Log message", vi: "Nội dung log" },
            req: true,
          },
        ],
        ret: "void",
        example: 'log("Step 1 complete ✅")',
      },
    ],
  },
  {
    id: "timing",
    icon: '<i data-lucide="timer" style="width:16px;height:16px;"></i>',
    title: { en: "Timing & Sleep", vi: "Thời gian & Chờ" },
    desc: {
      en: "Control script timing with sleep, random delays, and smart waits.",
      vi: "Điều khiển thời gian script với sleep, delay ngẫu nhiên.",
    },
    apis: [
      {
        name: "sleep(seconds)",
        type: "func",
        desc: {
          en: "Pause execution for specified seconds",
          vi: "Tạm dừng thực thi trong khoảng thời gian",
        },
        params: [
          {
            n: "seconds",
            t: "number",
            d: {
              en: "Wait duration (supports decimals)",
              vi: "Thời gian chờ (hỗ trợ số thập phân)",
            },
            req: true,
          },
        ],
        ret: "void",
        example: "sleep(1.5)  -- Wait 1.5 seconds",
      },
      {
        name: "usleep(microseconds)",
        type: "func",
        desc: {
          en: "Pause for microseconds (high precision)",
          vi: "Tạm dừng theo microsecond (độ chính xác cao)",
        },
        params: [
          {
            n: "microseconds",
            t: "number",
            d: {
              en: "Wait in microseconds",
              vi: "Thời gian chờ (microsecond)",
            },
            req: true,
          },
        ],
        ret: "void",
        example: "usleep(500000)  -- Wait 0.5s",
      },
      {
        name: "randomSleep(min, max)",
        type: "func",
        desc: {
          en: "Sleep random duration between min and max",
          vi: "Ngủ ngẫu nhiên trong khoảng min đến max",
        },
        params: [
          {
            n: "min",
            t: "number",
            d: { en: "Minimum seconds", vi: "Tối thiểu (giây)" },
            req: true,
          },
          {
            n: "max",
            t: "number",
            d: { en: "Maximum seconds", vi: "Tối đa (giây)" },
            req: true,
          },
        ],
        ret: "void",
        example: "randomSleep(0.5, 2.0)  -- Anti-detection",
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "screen",
    icon: '<i data-lucide="monitor" style="width:16px;height:16px;"></i>',
    title: { en: "Screen Info", vi: "Thông tin màn hình" },
    desc: {
      en: "Get screen dimensions, resolution, and live streaming.",
      vi: "Lấy kích thước, độ phân giải, và stream trực tiếp.",
    },
    apis: [
      {
        name: "screenSize()",
        type: "func",
        desc: { en: "Get screen dimensions", vi: "Lấy kích thước màn hình" },
        params: [],
        ret: "table — {width, height}",
        example:
          'local s = screenSize()\nlog("Screen: " .. s.width .. "x" .. s.height)',
      },
      {
        name: "deviceInfo()",
        type: "func",
        desc: {
          en: "Get device model, iOS version, battery",
          vi: "Lấy thông tin thiết bị, iOS, pin",
        },
        params: [],
        ret: "table — device details",
        example: 'local d = deviceInfo()\nlog(d.model .. " iOS " .. d.version)',
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "http",
    icon: '<i data-lucide="globe" style="width:16px;height:16px;"></i>',
    title: { en: "HTTP Client", vi: "HTTP Client" },
    desc: {
      en: "Make HTTP requests from scripts to external APIs.",
      vi: "Gọi HTTP request từ script đến API bên ngoài.",
    },
    apis: [
      {
        name: "httpGet(url, params, headers)",
        type: "func",
        desc: { en: "HTTP GET request", vi: "Gửi yêu cầu HTTP GET" },
        params: [
          {
            n: "url",
            t: "string",
            d: { en: "Request URL", vi: "URL yêu cầu" },
            req: true,
          },
          {
            n: "params",
            t: "table",
            d: {
              en: "Query parameters dict (will be appended as ?key=val&...)",
              vi: "Dict tham số query (sẽ nối thành ?key=val&...)",
            },
            req: false,
          },
          {
            n: "headers",
            t: "table",
            d: { en: "Optional headers", vi: "Headers tuỳ chọn" },
            req: false,
          },
        ],
        ret: "table — {status, body, headers}",
        example_py:
          '# Fetch game server config\nr = http_get("https://api.example.com/config", {\n    "version": "1.2.0",\n    "platform": "ios"\n})\nif r["status"] == 200:\n    import json\n    config = json.loads(r["body"])\n    log(f"Server version: {config[\"version\"]}")\n    log(f"Maintenance: {config[\"maintenance\"]}")\nelse:\n    log(f"Error: HTTP {r[\"status\"]}")',
        example:
          '-- Fetch game server config\nlocal r = httpGet("https://api.example.com/config", {\n  version = "1.2.0",\n  platform = "ios"\n})\nif r.status == 200 then\n  local config = jsonDecode(r.body)\n  log("Server version: " .. config.version)\n  log("Maintenance: " .. tostring(config.maintenance))\nelse\n  log("Error: HTTP " .. r.status)\nend',
        tags: ["exclusive"],
      },
      {
        name: "httpPost(url, body, headers)",
        type: "func",
        desc: { en: "HTTP POST request", vi: "Gửi yêu cầu HTTP POST" },
        params: [
          {
            n: "url",
            t: "string",
            d: { en: "Request URL", vi: "URL yêu cầu" },
            req: true,
          },
          {
            n: "body",
            t: "table|string",
            d: { en: "Request body", vi: "Nội dung yêu cầu" },
            req: true,
          },
          {
            n: "headers",
            t: "table",
            d: { en: "Optional headers", vi: "Headers tuỳ chọn" },
            req: false,
          },
        ],
        ret: "table — {status, body, headers}",
        example: 'local r = httpPost(url, {key="value"})',
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "file",
    icon: '<i data-lucide="folder" style="width:16px;height:16px;"></i>',
    title: { en: "File & JSON", vi: "Tệp & JSON" },
    desc: {
      en: "Read/write files and parse JSON data.",
      vi: "Đọc/ghi tệp và xử lý dữ liệu JSON.",
    },
    apis: [
      {
        name: "readFile(path)",
        type: "func",
        desc: { en: "Read text file contents", vi: "Đọc nội dung tệp văn bản" },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "File path", vi: "Đường dẫn tệp" },
            req: true,
          },
        ],
        ret: "string",
        example_py:
          '# Load saved settings\nimport json\nraw = read_file("/var/mobile/Library/IOSControl/config.json")\nconfig = json.loads(raw)\nlog(f"Loops: {config[\"loops\"]}")\nlog(f"Delay: {config[\"delay\"]}s")',
        example:
          '-- Load saved settings\nlocal raw = readFile("/var/mobile/Library/IOSControl/config.json")\nlocal config = jsonDecode(raw)\nlog("Loops: " .. config.loops)\nlog("Delay: " .. config.delay .. "s")',
        tags: ["exclusive"],
      },
      {
        name: "writeFile(path, content)",
        type: "func",
        desc: { en: "Write string to file", vi: "Ghi chuỗi vào tệp" },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "File path", vi: "Đường dẫn tệp" },
            req: true,
          },
          {
            n: "content",
            t: "string",
            d: { en: "File content", vi: "Nội dung tệp" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Save automation results to log\nimport json, time\nresults = {\n    "coins": 1500,\n    "runs": 10,\n    "time": time.strftime("%Y-%m-%d %H:%M:%S")\n}\nwrite_file("results.json", json.dumps(results))\nlog("Results saved!")',
        example:
          '-- Save automation results to log\nlocal results = {\n  coins = 1500,\n  runs = 10,\n  time = os.date("%Y-%m-%d %H:%M:%S")\n}\nwriteFile("results.json", jsonEncode(results))\nlog("Results saved!")',
        tags: ["exclusive"],
      },
      {
        name: "appendFile(path, content)",
        type: "func",
        desc: {
          en: "Append text to file (creates if not exists)",
          vi: "Ghi thêm vào cuối file (tạo nếu chưa có)",
        },
        params: [
          {
            n: "path",
            t: "string",
            d: { en: "File path", vi: "Đường dẫn tệp" },
            req: true,
          },
          {
            n: "content",
            t: "string",
            d: { en: "Text to append", vi: "Nội dung ghi thêm" },
            req: true,
          },
        ],
        ret: "boolean",
        example:
          '-- Log results to file\nfor i = 1, 10 do\n  tap(200, 400)\n  sleep(1)\n  appendFile("log.txt", "Run " .. i .. " done\\n")\nend',
        tags: ["new", "exclusive"],
      },
      {
        name: "jsonDecode(str)",
        type: "func",
        desc: {
          en: "Parse JSON string to table",
          vi: "Phân tích chuỗi JSON sang bảng",
        },
        params: [
          {
            n: "str",
            t: "string",
            d: { en: "JSON string", vi: "Chuỗi JSON" },
            req: true,
          },
        ],
        ret: "table",
        example: 'local t = jsonDecode(\'{"name":"test"}\')',
        tags: ["exclusive"],
      },
      {
        name: "jsonEncode(table)",
        type: "func",
        desc: {
          en: "Convert table to JSON string",
          vi: "Chuyển bảng thành chuỗi JSON",
        },
        params: [
          {
            n: "table",
            t: "table",
            d: { en: "Lua table", vi: "Bảng Lua" },
            req: true,
          },
        ],
        ret: "string",
        example: "local s = jsonEncode({score=100})",
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "util",
    icon: '<i data-lucide="wrench" style="width:16px;height:16px;"></i>',
    title: { en: "Utilities", vi: "Tiện ích" },
    desc: {
      en: "Random numbers, device info, and miscellaneous tools.",
      vi: "Số ngẫu nhiên, thông tin thiết bị, và các công cụ khác.",
    },
    apis: [
      {
        name: "randomInt(min, max)",
        type: "func",
        desc: {
          en: "Random integer in range",
          vi: "Số nguyên ngẫu nhiên trong khoảng",
        },
        params: [
          {
            n: "min",
            t: "number",
            d: { en: "Minimum", vi: "Tối thiểu" },
            req: true,
          },
          {
            n: "max",
            t: "number",
            d: { en: "Maximum", vi: "Tối đa" },
            req: true,
          },
        ],
        ret: "number",
        example: "local x = randomInt(100, 300)",
        tags: ["exclusive"],
      },
      {
        name: "randomFloat(min, max)",
        type: "func",
        desc: {
          en: "Random float in range",
          vi: "Số thực ngẫu nhiên trong khoảng",
        },
        params: [
          {
            n: "min",
            t: "number",
            d: { en: "Minimum", vi: "Tối thiểu" },
            req: true,
          },
          {
            n: "max",
            t: "number",
            d: { en: "Maximum", vi: "Tối đa" },
            req: true,
          },
        ],
        ret: "number",
        example: "local d = randomFloat(0.1, 0.5)",
        tags: ["exclusive"],
      },
      {
        name: "wifiInfo()",
        type: "func",
        desc: {
          en: "Get WiFi SSID and IP address",
          vi: "Lấy SSID WiFi và địa chỉ IP",
        },
        params: [],
        ret: "table — {ssid, ip}",
        example: "local w = wifiInfo()\nlog(w.ip)",
        tags: ["exclusive"],
      },
      {
        name: "setCellularData(enabled, delay)",
        type: "func",
        desc: {
          en: "Toggle 4G/cellular data on or off",
          vi: "Bật/tắt dữ liệu di động 4G",
        },
        params: [
          {
            n: "enabled",
            t: "boolean",
            d: { en: "true = on, false = off", vi: "true = bật, false = tắt" },
            req: true,
          },
          {
            n: "delay",
            t: "number",
            d: {
              en: "Auto-restore after N seconds (optional)",
              vi: "Tự phục hồi sau N giây (tuỳ chọn)",
            },
            req: false,
          },
        ],
        ret: "void",
        example:
          "-- Turn off cellular for 5 seconds then back on\nsetCellularData(false, 5)\n\n-- Permanently turn off\nsetCellularData(false)\n\n-- Turn back on\nsetCellularData(true)",
        tags: ["new", "exclusive"],
      },
      {
        name: "setAirplaneMode(enabled, delay)",
        type: "func",
        desc: {
          en: "Toggle airplane mode on or off",
          vi: "Bật/tắt chế độ máy bay",
        },
        params: [
          {
            n: "enabled",
            t: "boolean",
            d: { en: "true = on, false = off", vi: "true = bật, false = tắt" },
            req: true,
          },
          {
            n: "delay",
            t: "number",
            d: {
              en: "Auto-restore after N seconds (optional)",
              vi: "Tự phục hồi sau N giây (tuỳ chọn)",
            },
            req: false,
          },
        ],
        ret: "void",
        example:
          '-- Reset network: airplane on 3s then off\nsetAirplaneMode(true, 3)\nsleep(4)\nlog("Network reset complete")',
        tags: ["new", "exclusive"],
      },
      {
        name: "getIP()",
        type: "func",
        desc: {
          en: "Get public IP address (via api.ipify.org)",
          vi: "Lấy IP công cộng (qua api.ipify.org)",
        },
        params: [],
        ret: "string — public IP address",
        example:
          '-- Check IP before and after airplane mode\nlocal ip1 = getIP()\nlog("Before: " .. ip1)\nsetAirplaneMode(true, 3)\nsleep(5)\nlocal ip2 = getIP()\nlog("After: " .. ip2)',
        tags: ["new", "exclusive"],
      },
    ],
  },
  {
    id: "record",
    icon: '<i data-lucide="video" style="width:16px;height:16px;"></i>',
    title: { en: "Record & Playback", vi: "Ghi & Phát lại" },
    desc: {
      en: "Record touch actions and replay them as scripts.",
      vi: "Ghi lại thao tác chạm và phát lại dưới dạng script.",
    },
    apis: [
      {
        name: "recordStart()",
        type: "func",
        desc: {
          en: "Start recording touch events",
          vi: "Bắt đầu ghi sự kiện chạm",
        },
        params: [],
        ret: "void",
        example_py:
          '# Record a login flow and save it\nlog("Recording started... perform actions")\nrecord_start()\nsleep(10)  # Wait for user actions\nevents = record_stop()\nlog(f"Recorded {len(events)} events")\nrecord_save("login_flow")\nlog("Saved as login_flow")',
        example:
          '-- Record a login flow and save it\nlog("Recording started... perform actions on device")\nrecordStart()\nsleep(10)  -- Wait for user to perform actions\nlocal events = recordStop()\nlog("Recorded " .. #events .. " events")\nrecordSave("login_flow")\nlog("Saved as login_flow")',
      },
      {
        name: "recordStop()",
        type: "func",
        desc: {
          en: "Stop recording and save events",
          vi: "Dừng ghi và lưu sự kiện",
        },
        params: [],
        ret: "table — recorded events",
        example: "local events = recordStop()",
      },
      {
        name: "recordPlay(events)",
        type: "func",
        desc: { en: "Replay recorded events", vi: "Phát lại sự kiện đã ghi" },
        params: [
          {
            n: "events",
            t: "table",
            d: {
              en: "Events from recordStop()",
              vi: "Sự kiện từ recordStop()",
            },
            req: true,
          },
        ],
        ret: "void",
        example: "recordPlay(events)",
      },
      {
        name: "recordSave(name)",
        type: "func",
        desc: { en: "Save recording to file", vi: "Lưu bản ghi vào tệp" },
        params: [
          {
            n: "name",
            t: "string",
            d: { en: "Recording name", vi: "Tên bản ghi" },
            req: true,
          },
        ],
        ret: "void",
        example: 'recordSave("login_flow")',
      },
      {
        name: "recordLoad(name)",
        type: "func",
        desc: { en: "Load recording from file", vi: "Tải bản ghi từ tệp" },
        params: [
          {
            n: "name",
            t: "string",
            d: { en: "Recording name", vi: "Tên bản ghi" },
            req: true,
          },
        ],
        ret: "table — events",
        example: 'local e = recordLoad("login_flow")\nrecordPlay(e)',
      },
    ],
  },
  {
    id: "schedule",
    icon: '<i data-lucide="calendar" style="width:16px;height:16px;"></i>',
    title: { en: "Scheduler", vi: "Lập lịch" },
    desc: {
      en: "Schedule scripts to run at specific times or on events.",
      vi: "Lập lịch chạy script vào thời điểm cụ thể hoặc theo sự kiện.",
    },
    apis: [
      {
        name: "schedule(cron, script)",
        type: "func",
        desc: {
          en: "Schedule script with cron expression",
          vi: "Lập lịch script bằng biểu thức cron",
        },
        params: [
          {
            n: "cron",
            t: "string",
            d: {
              en: 'Cron expression (e.g. "0 8 * * *")',
              vi: 'Biểu thức cron (VD: "0 8 * * *")',
            },
            req: true,
          },
          {
            n: "script",
            t: "string",
            d: { en: "Script filename", vi: "Tên tệp script" },
            req: true,
          },
        ],
        ret: "string — schedule ID",
        example_py:
          '# Run daily farm at 8 AM\nid = schedule("0 8 * * *", "daily_farm.lua")\nlog(f"Scheduled daily farm, ID: {id}")\n\n# Run every 30 minutes\nschedule("*/30 * * * *", "check_energy.lua")',
        example:
          '-- Run daily farm at 8 AM\nlocal id = schedule("0 8 * * *", "daily_farm.lua")\nlog("Scheduled daily farm, ID: " .. id)\n\n-- Run every 30 minutes\nschedule("*/30 * * * *", "check_energy.lua")',
        tags: ["exclusive"],
      },
      {
        name: "scheduleAfter(seconds, script)",
        type: "func",
        desc: {
          en: "Run script after delay",
          vi: "Chạy script sau khoảng thời gian",
        },
        params: [
          {
            n: "seconds",
            t: "number",
            d: { en: "Delay in seconds", vi: "Thời gian trì hoãn (giây)" },
            req: true,
          },
          {
            n: "script",
            t: "string",
            d: { en: "Script filename", vi: "Tên tệp script" },
            req: true,
          },
        ],
        ret: "string — schedule ID",
        example: 'scheduleAfter(3600, "hourly.lua")',
        tags: ["exclusive"],
      },
      {
        name: "onNotification(app, action)",
        type: "func",
        desc: {
          en: "Trigger action on push notification",
          vi: "Kích hoạt hành động khi có thông báo đẩy",
        },
        params: [
          {
            n: "app",
            t: "string",
            d: { en: "App bundle ID", vi: "Bundle ID ứng dụng" },
            req: true,
          },
          {
            n: "action",
            t: "function",
            d: { en: "Callback function", vi: "Hàm callback" },
            req: true,
          },
        ],
        ret: "void",
        example_py:
          '# Auto-reply when WhatsApp notification arrives\ndef on_msg(info):\n    log(f"New message from: {info[\"title\"]}")\n    app_run("net.whatsapp.WhatsApp")\n    sleep(2)\n    tap(200, 100)  # Tap notification chat\n    sleep(1)\n    input_text("Auto-reply: I\'m busy right now")\n    tap(380, 800)  # Send button\n\non_notification("net.whatsapp.WhatsApp", on_msg)',
        example:
          '-- Auto-reply when WhatsApp notification arrives\nonNotification("net.whatsapp.WhatsApp", function(info)\n  log("New message from: " .. info.title)\n  appRun("net.whatsapp.WhatsApp")\n  sleep(2)\n  -- Tap the notification chat\n  tap(200, 100)\n  sleep(1)\n  inputText("Auto-reply: I\'m busy right now")\n  tap(380, 800)  -- Send button\nend)',
        tags: ["exclusive"],
      },
    ],
  },
  {
    id: "rest",
    icon: '<i data-lucide="plug" style="width:16px;height:16px;"></i>',
    title: { en: "HTTP APIs", vi: "HTTP APIs" },
    desc: {
      en: "Control IOSControl remotely via HTTP endpoints. All endpoints are on the iPhone daemon at port 9999.",
      vi: "Điều khiển IOSControl từ xa qua HTTP. Tất cả endpoint chạy trên daemon iPhone port 9999.",
    },
    apis: [
      {
        name: "POST /api/scripts/run",
        type: "post",
        desc: {
          en: "Play a script — execute Lua code on the device",
          vi: "Chạy script — thực thi code Lua trên thiết bị",
        },
        params: [
          {
            n: "code",
            t: "string",
            d: { en: "Lua code to execute", vi: "Code Lua cần thực thi" },
            req: true,
          },
          {
            n: "scriptName",
            t: "string",
            d: {
              en: "Script filename (for tracking)",
              vi: "Tên file script (để theo dõi)",
            },
            req: false,
          },
        ],
        ret: "JSON {success, taskId}",
        example:
          'curl -X POST http://{device-ip}:9999/api/scripts/run \\\\\n  -H "Content-Type: application/json" \\\\\n  -d \'{"code":"tap(100,200)\\nsleep(1)\\nlog(\\"done\\")", "scriptName":"test.lua"}\'',
      },

      {
        name: "POST /api/scripts/stop",
        type: "post",
        desc: {
          en: "Stop playing a script — sends stop signal to running script",
          vi: "Dừng script đang chạy — gửi tín hiệu dừng",
        },
        params: [],
        ret: "JSON {success, message}",
        example: "curl -X POST http://{device-ip}:9999/api/scripts/stop",
      },

      {
        name: "GET /api/scripts/running",
        type: "get",
        desc: {
          en: "Check if a script is currently running",
          vi: "Kiểm tra script có đang chạy không",
        },
        params: [],
        ret: "JSON {running, taskId, scriptName}",
        example:
          'curl http://{device-ip}:9999/api/scripts/running\n\n# Response: {"running":true,"taskId":"ABC-123","scriptName":"bot.lua"}',
      },

      {
        name: "GET /api/scripts/{taskId}/status",
        type: "get",
        desc: {
          en: "Get script execution status and logs",
          vi: "Lấy trạng thái thực thi và log của script",
        },
        params: [
          {
            n: "taskId",
            t: "string",
            d: {
              en: "Task ID returned from /run",
              vi: "Task ID trả về từ /run",
            },
            req: true,
          },
        ],
        ret: "JSON {success, status, logs, error}",
        example:
          'curl http://{device-ip}:9999/api/scripts/ABC-123/status\n\n# Response: {"success":true,"status":"done","logs":[{"message":"done"}]}',
      },

      {
        name: "GET /api/scripts/files",
        type: "get",
        desc: {
          en: "List files in scripts directory",
          vi: "Liệt kê file trong thư mục scripts",
        },
        params: [],
        ret: "JSON {success, files: [{name, size, modified}]}",
        example: "curl http://{device-ip}:9999/api/scripts/files",
      },

      {
        name: "GET /api/scripts/load",
        type: "get",
        desc: {
          en: "Load a script file content",
          vi: "Đọc nội dung file script",
        },
        params: [
          {
            n: "name",
            t: "string",
            d: { en: "Script filename", vi: "Tên file script" },
            req: true,
          },
        ],
        ret: "JSON {success, name, code}",
        example: 'curl "http://{device-ip}:9999/api/scripts/load?name=bot.lua"',
      },

      {
        name: "POST /api/scripts/save",
        type: "post",
        desc: {
          en: "Create or update a script file",
          vi: "Tạo hoặc cập nhật file script",
        },
        params: [
          {
            n: "name",
            t: "string",
            d: { en: "Script filename", vi: "Tên file script" },
            req: true,
          },
          {
            n: "code",
            t: "string",
            d: { en: "Script content", vi: "Nội dung script" },
            req: true,
          },
        ],
        ret: "JSON {success, name}",
        example:
          'curl -X POST http://{device-ip}:9999/api/scripts/save \\\\\n  -H "Content-Type: application/json" \\\\\n  -d \'{"name":"bot.lua","code":"tap(100,200)"}\'',
      },

      {
        name: "POST /api/scripts/delete",
        type: "post",
        desc: { en: "Delete a script file", vi: "Xóa file script" },
        params: [
          {
            n: "name",
            t: "string",
            d: {
              en: "Script filename to delete",
              vi: "Tên file script cần xóa",
            },
            req: true,
          },
        ],
        ret: "JSON {success}",
        example:
          'curl -X POST http://{device-ip}:9999/api/scripts/delete \\\\\n  -H "Content-Type: application/json" \\\\\n  -d \'{"name":"old_script.lua"}\'',
      },

      {
        name: "GET /ping",
        type: "get",
        desc: {
          en: "Health check — verify daemon is running",
          vi: "Kiểm tra daemon đang chạy",
        },
        params: [],
        ret: "JSON {status, version, name, ip}",
        example:
          'curl http://{device-ip}:9999/ping\n\n# Response: {"status":"ok","version":"1.0.0","name":"IOSControl","ip":"192.168.1.x"}',
      },
    ],
  },
  {
    id: "spoof",
    icon: '<i data-lucide="smartphone" style="width:16px;height:16px;"></i>',
    title: { en: "Device Spoofing", vi: "Giả lập thiết bị" },
    desc: {
      en: "Fake device model, iOS version, serial number, and carrier for specific apps. Premium feature.",
      vi: "Fake model thiết bị, phiên bản iOS, số serial, và nhà mạng cho từng app. Tính năng Premium.",
    },
    apis: [
      {
        name: "ic.spoof.name()",
        type: "func",
        desc: { en: "Get current spoofed device name", vi: "Lấy tên thiết bị đang fake" },
        params: [],
        ret: "string",
        example: 'local name = ic.spoof.name()\nlog("Spoofed as: " .. name)',
        tags: ["new", "exclusive"],
      },
      {
        name: "ic.spoof.model()",
        type: "func",
        desc: { en: "Get current spoofed model identifier", vi: "Lấy mã model đang fake" },
        params: [],
        ret: "string (e.g. \"iPhone15,3\")",
        example: 'local m = ic.spoof.model()\nlog("Model: " .. m)  -- iPhone15,3',
        tags: ["new", "exclusive"],
      },
      {
        name: "ic.spoof.ios()",
        type: "func",
        desc: { en: "Get current spoofed iOS version", vi: "Lấy phiên bản iOS đang fake" },
        params: [],
        ret: "string (e.g. \"16.5.1\")",
        example: 'log("iOS: " .. ic.spoof.ios())',
        tags: ["new", "exclusive"],
      },
      {
        name: "ic.spoof.serial()",
        type: "func",
        desc: { en: "Get current spoofed serial number", vi: "Lấy số serial đang fake" },
        params: [],
        ret: "string",
        example: 'log("Serial: " .. ic.spoof.serial())',
        tags: ["new", "exclusive"],
      },
      {
        name: "ic.spoof.carrier()",
        type: "func",
        desc: { en: "Get current spoofed carrier name", vi: "Lấy tên nhà mạng đang fake" },
        params: [],
        ret: "string",
        example: 'log("Carrier: " .. ic.spoof.carrier())',
        tags: ["new", "exclusive"],
      },
    ],
  },
];

// UI Translation strings
const UI_STRINGS = {
  en: {
    apiRef: "DOCUMENTS",
    searchPlaceholder: "Search APIs... (⌘K)",
    parameters: "Parameters",
    name: "Name",
    type: "Type",
    description: "Description",
    returns: "Returns",
    example: "Example",
    restEndpoint: "REST API Endpoint",
    noResults: "No results found",
    required: "required",
    optional: "optional",
    tagNew:
      '<i data-lucide="sparkles" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>New',
    tagExclusive:
      '<i data-lucide="star" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>IOSControl Exclusive',
    tagAdvanced:
      '<i data-lucide="wand-2" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>Advanced',
    introTitle: "IOSControl",
    introTitleHL: "Documents",
    introDesc: (total, cats) =>
      `<strong>${total}</strong> functions across <strong>${cats}</strong> categories. A complete iOS automation framework — write Lua scripts that execute natively on your jailbroken iPhone. Touch injection, color detection, OCR, image matching, network control, file I/O, and more.`,
    qs1Title: "Quick Setup",
    qs1Desc:
      "Install via <code>Sileo/Cydia</code>. Access the Web IDE at <code>http://device-ip:9999/ide</code>",
    qs2Title: "Touch & Gestures",
    qs2Desc:
      "Native HID injection — <code>tap</code>, <code>swipe</code>, <code>pinch</code>, <code>rotate</code>, multi-finger",
    qs3Title: "Smart Automation",
    qs3Desc:
      "<code>tapImage</code>, <code>tapText</code>, <code>swipeUntilText</code> — find + act in one call",
    qs4Title: "Network Control",
    qs4Desc:
      "<code>setCellularData</code>, <code>setAirplaneMode</code>, <code>getIP</code> — IP rotation & reset",
    qs5Title: "Stats Overlay",
    qs5Desc:
      "<code>showOverlay</code> — transparent HUD on screen, touch passes through",
    qs6Title: "User Input",
    qs6Desc:
      "<code>dialogInput</code>, <code>dialogChoice</code> — get runtime input from user",
  },
  vi: {
    apiRef: "TÀI LIỆU",
    searchPlaceholder: "Tìm kiếm API... (⌘K)",
    parameters: "Tham số",
    name: "Tên",
    type: "Kiểu",
    description: "Mô tả",
    returns: "Trả về",
    example: "Ví dụ",
    restEndpoint: "REST API Endpoint",
    noResults: "Không tìm thấy kết quả",
    required: "bắt buộc",
    optional: "tuỳ chọn",
    tagNew:
      '<i data-lucide="sparkles" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>Mới',
    tagExclusive:
      '<i data-lucide="star" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>Độc quyền IOSControl',
    tagAdvanced:
      '<i data-lucide="wand-2" style="width:12px;height:12px;vertical-align:-2px;margin-right:2px;"></i>Nâng cao',
    introTitle: "IOSControl",
    introTitleHL: "Tài liệu",
    introDesc: (total, cats) =>
      `<strong>${total}</strong> hàm trên <strong>${cats}</strong> danh mục. Framework tự động hoá iOS hoàn chỉnh — viết Lua script chạy trực tiếp trên iPhone jailbreak. Touch injection, nhận diện màu, OCR, tìm hình, điều khiển mạng, file I/O và nhiều hơn.`,
    qs1Title: "Cài đặt",
    qs1Desc:
      "Cài qua <code>Sileo/Cydia</code>. Truy cập Web IDE tại <code>http://ip:9999/ide</code>",
    qs2Title: "Chạm & Cử chỉ",
    qs2Desc:
      "HID injection — <code>tap</code>, <code>swipe</code>, <code>pinch</code>, <code>rotate</code>, đa ngón",
    qs3Title: "Tự động thông minh",
    qs3Desc:
      "<code>tapImage</code>, <code>tapText</code>, <code>swipeUntilText</code> — tìm + hành động 1 lệnh",
    qs4Title: "Điều khiển mạng",
    qs4Desc:
      "<code>setCellularData</code>, <code>setAirplaneMode</code>, <code>getIP</code> — đổi IP & reset mạng",
    qs5Title: "Bảng thống kê",
    qs5Desc:
      "<code>showOverlay</code> — HUD trong suốt trên màn hình, chạm xuyên qua",
    qs6Title: "Nhập liệu",
    qs6Desc:
      "<code>dialogInput</code>, <code>dialogChoice</code> — nhận input từ người dùng",
  },
};
