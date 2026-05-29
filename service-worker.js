<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- PWA -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#003087">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="PM Audit">
  <link rel="apple-touch-icon" href="icon-192.png">
  <link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">
<title>PM Audit Platform · XP Fibre SFR</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Syne',sans-serif;background:#F4F6FA;color:#0A1628;font-size:14px}

/* ── VARS ── */
:root{
  --blue:#003087; --blue-mid:#1565C0; --blue-lt:#E8F0FB;
  --red:#E2001A; --red-lt:#FDECEA;
  --green:#1A7C3E; --green-lt:#E8F5E9;
  --yellow:#B45309; --yellow-lt:#FFF8E1;
  --gray:#F4F6FA; --gray2:#E8EDF5; --gray3:#DDE3EE;
  --text:#0A1628; --text2:#3D5173; --text3:#5A6A85; --text4:#94A3B8;
  --white:#ffffff; --dark:#0A1628;
  --radius:8px; --mono:'JetBrains Mono',monospace;
}

/* ── SCREENS ── */
.screen{display:none}
.screen.active{display:block}

/* ══════════════════════════════════
   LOGIN PAGE
══════════════════════════════════ */
#screen-login{
  min-height:100vh;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#001a5c 0%,#003087 50%,#001a5c 100%);
  position:relative;overflow:hidden;
}
#screen-login.active{display:flex}
.login-bg-circle{position:absolute;border-radius:50%;pointer-events:none}
.login-card{
  background:#fff;border-radius:16px;padding:36px 40px;
  width:100%;max-width:420px;position:relative;z-index:1;
  box-shadow:0 24px 60px rgba(0,0,0,.3);
}
.login-logo{display:flex;align-items:center;gap:10px;margin-bottom:28px}
.login-logo-sfr{background:var(--red);color:#fff;font-size:12px;font-weight:800;padding:4px 12px;border-radius:5px;letter-spacing:.5px}
.login-logo-name{font-size:14px;font-weight:800;color:var(--blue);letter-spacing:-.3px}
.login-title{font-size:22px;font-weight:900;color:var(--text);letter-spacing:-.5px;margin-bottom:4px}
.login-sub{font-size:12px;color:var(--text3);margin-bottom:28px;font-family:var(--mono)}
.login-label{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:5px}
.login-input{
  width:100%;padding:10px 14px;border-radius:var(--radius);
  border:1.5px solid var(--gray3);background:var(--gray);
  font-family:var(--mono);font-size:13px;color:var(--text);
  outline:none;transition:border-color .15s,box-shadow .15s;
  margin-bottom:16px;
}
.login-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,48,135,.08);background:#fff}
.login-input::placeholder{color:var(--text4)}
.btn-login{
  width:100%;padding:12px;border-radius:var(--radius);
  background:linear-gradient(135deg,var(--blue),var(--blue-mid));
  border:none;color:#fff;font-family:'Syne',sans-serif;
  font-size:14px;font-weight:800;cursor:pointer;
  transition:all .2s;letter-spacing:.3px;margin-top:4px;
}
.btn-login:hover{opacity:.9;box-shadow:0 4px 16px rgba(0,48,135,.3);transform:translateY(-1px)}
.btn-login:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
.login-error{
  background:var(--red-lt);border:1px solid rgba(226,0,26,.3);
  border-radius:var(--radius);padding:10px 14px;
  font-size:12px;color:var(--red);margin-bottom:16px;
  display:none;font-family:var(--mono);
}
.login-error.show{display:block}
.login-footer{margin-top:20px;text-align:center;font-size:11px;color:var(--text4);font-family:var(--mono)}

/* ══════════════════════════════════
   APP NAV
══════════════════════════════════ */
.app-nav{
  position:sticky;top:0;z-index:200;
  background:var(--blue);border-bottom:2px solid var(--red);
  display:flex;align-items:center;padding:0 20px;height:54px;gap:0;
}
.nav-logo{display:flex;align-items:center;gap:8px;cursor:pointer;margin-right:20px}
.nav-logo-sfr{background:var(--red);color:#fff;font-size:11px;font-weight:800;padding:2px 8px;border-radius:3px;letter-spacing:.5px}
.nav-logo-name{color:#fff;font-size:13px;font-weight:700;letter-spacing:-.2px}
.nav-role-badge{
  font-size:10px;font-weight:700;padding:3px 10px;border-radius:4px;
  letter-spacing:.5px;font-family:var(--mono);margin-right:16px;
  background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:#fff;
}
.nav-tabs{display:flex;gap:2px}
.nav-tab{
  padding:6px 14px;border-radius:6px;border:none;background:transparent;
  color:rgba(255,255,255,.65);font-family:'Syne',sans-serif;font-size:12px;
  font-weight:600;cursor:pointer;transition:all .15s;
}
.nav-tab.active{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.25)}
.nav-tab:hover:not(.active){color:#fff}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.nav-user{font-size:11px;color:rgba(255,255,255,.7);font-family:var(--mono)}
.btn-nav-sm{
  font-size:11px;padding:5px 12px;border-radius:6px;
  border:1px solid rgba(255,255,255,.25);background:transparent;
  color:rgba(255,255,255,.8);cursor:pointer;transition:all .15s;font-family:'Syne',sans-serif;
}
.btn-nav-sm:hover{background:rgba(255,255,255,.1);color:#fff}
.btn-logout{border-color:rgba(226,0,26,.4);color:rgba(255,200,200,.9)}
.btn-logout:hover{background:rgba(226,0,26,.15);color:#fff}

/* ══════════════════════════════════
   MAIN CONTENT
══════════════════════════════════ */
.main{padding:24px;min-height:calc(100vh - 54px)}
.page{display:none}.page.active{display:block}
.page-title{font-size:20px;font-weight:800;letter-spacing:-.5px;color:var(--text);margin-bottom:4px}
.page-sub{font-size:11px;color:var(--text3);font-family:var(--mono)}

/* ── STATS ROW ── */
.stats-row{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
.sc{background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:10px 16px;flex:1;min-width:90px}
.sc-l{font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:1px;font-family:var(--mono)}
.sc-v{font-size:20px;font-weight:800;margin-top:2px;letter-spacing:-1px}

/* ── CARDS / FORMS ── */
.card{background:#fff;border:1px solid var(--gray3);border-radius:12px;overflow:hidden}
.card-hdr{padding:12px 16px;background:var(--gray);border-bottom:1px solid var(--gray3);display:flex;align-items:center;justify-content:space-between}
.card-title{font-size:12px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.8px;display:flex;align-items:center;gap:8px}
.card-title-bar{width:3px;height:13px;background:var(--red);border-radius:2px}
.card-body{padding:18px}
.form-label{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;display:block;margin-bottom:5px}
.form-input,.form-select,.form-textarea{
  width:100%;background:var(--gray);border:1px solid var(--gray3);
  border-radius:var(--radius);padding:8px 12px;color:var(--text);
  font-family:var(--mono);font-size:12px;outline:none;transition:border-color .15s;
  margin-bottom:14px;
}
.form-input:focus,.form-textarea:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 2px rgba(0,48,135,.06)}
.form-input::placeholder,.form-textarea::placeholder{color:var(--text4)}
.form-textarea{resize:vertical;min-height:70px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-group{margin-bottom:0}

/* ── BUTTONS ── */
.btn{padding:8px 18px;border-radius:var(--radius);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;border:none;letter-spacing:.2px}
.btn-primary{background:linear-gradient(135deg,var(--blue),var(--blue-mid));color:#fff}
.btn-primary:hover{opacity:.9;box-shadow:0 4px 12px rgba(0,48,135,.25)}
.btn-danger{background:var(--red-lt);color:var(--red);border:1px solid rgba(226,0,26,.3)}
.btn-danger:hover{background:rgba(226,0,26,.15)}
.btn-success{background:var(--green-lt);color:var(--green);border:1px solid rgba(26,124,62,.3)}
.btn-success:hover{background:rgba(26,124,62,.15)}
.btn-ghost{background:var(--gray);color:var(--text2);border:1px solid var(--gray3)}
.btn-ghost:hover{background:var(--gray2);color:var(--text)}
.btn-full{width:100%;padding:11px;font-size:13px}

/* Priorité */
.prio-btns{display:flex;gap:6px}
.prio-btn{flex:1;padding:7px;border-radius:var(--radius);border:1.5px solid var(--gray3);background:var(--gray);color:var(--text3);font-family:'Syne',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;text-align:center}
.prio-btn.active-haute{background:var(--red-lt);border-color:var(--red);color:var(--red)}
.prio-btn.active-moyenne{background:var(--yellow-lt);border-color:#F59E0B;color:var(--yellow)}
.prio-btn.active-basse{background:var(--green-lt);border-color:var(--green);color:var(--green)}

/* Upload zone */
.upload-zone{
  border:2px dashed var(--gray3);border-radius:var(--radius);
  padding:24px 16px;text-align:center;cursor:pointer;
  transition:all .2s;background:var(--gray);margin-bottom:14px;
}
.upload-zone:hover,.upload-zone.drag{border-color:var(--blue);background:var(--blue-lt)}
.upload-zone input[type=file]{display:none}
.file-pill{
  display:flex;align-items:center;gap:8px;
  background:var(--blue-lt);border:1px solid rgba(0,48,135,.2);
  border-radius:6px;padding:6px 12px;font-size:11px;
  color:var(--blue);font-family:var(--mono);margin-bottom:14px;
}

/* Mission cards */
.mission-card{
  background:#fff;border:1px solid var(--gray3);border-radius:10px;
  padding:14px 16px;margin-bottom:10px;transition:border-color .15s;
}
.mission-card:hover{border-color:var(--blue-mid)}
.mc-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.mc-ref{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--text)}
.mc-status{font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px;font-family:var(--mono)}
.mc-status.attente{background:var(--yellow-lt);color:var(--yellow);border:1px solid #F9C957}
.mc-status.en-cours{background:var(--blue-lt);color:var(--blue);border:1px solid rgba(0,48,135,.2)}
.mc-status.termine{background:var(--green-lt);color:var(--green);border:1px solid rgba(26,124,62,.25)}
.mc-body{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
.mc-field-l{font-size:10px;color:var(--text4);display:block;font-family:var(--mono)}
.mc-field-v{font-size:11px;color:var(--text);font-weight:600;font-family:var(--mono)}
.mc-note{font-size:11px;color:var(--yellow);background:var(--yellow-lt);border-left:3px solid #F59E0B;padding:6px 10px;border-radius:0 5px 5px 0;margin-bottom:10px}
.mc-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mc-actions{display:flex;gap:5px}
.btn-mc{font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid var(--gray3);background:var(--gray);color:var(--text3);cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;transition:all .15s}
.btn-mc:hover{color:var(--text);background:var(--gray2)}
.btn-mc.primary{background:var(--blue-lt);border-color:rgba(0,48,135,.2);color:var(--blue)}
.btn-mc.danger:hover{color:var(--red);border-color:rgba(226,0,26,.3);background:var(--red-lt)}
.btn-mc.rapport{background:var(--blue-lt);border-color:rgba(0,48,135,.2);color:var(--blue)}

/* ══════════════════════════════════
   ADMIN — GESTION COMPTES
══════════════════════════════════ */
.accounts-grid{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.account-row{
  display:flex;align-items:center;gap:12px;
  background:#fff;border:1px solid var(--gray3);border-radius:8px;padding:10px 14px;
}
.account-avatar{
  width:36px;height:36px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-weight:800;font-size:13px;flex-shrink:0;
}
.avatar-admin{background:#EDE9FE;color:#5B21B6}
.avatar-be{background:var(--blue-lt);color:var(--blue)}
.avatar-tech{background:var(--red-lt);color:var(--red)}
.account-name{font-size:13px;font-weight:700;color:var(--text)}
.account-email{font-size:10px;color:var(--text4);font-family:var(--mono)}
.role-badge{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;font-family:var(--mono);margin-left:8px;text-transform:uppercase;letter-spacing:.5px}
.badge-admin{background:#EDE9FE;color:#5B21B6;border:1px solid rgba(91,33,182,.2)}
.badge-be{background:var(--blue-lt);color:var(--blue);border:1px solid rgba(0,48,135,.2)}
.badge-tech{background:var(--red-lt);color:var(--red);border:1px solid rgba(226,0,26,.2)}
.badge-actif{background:var(--green-lt);color:var(--green);border:1px solid rgba(26,124,62,.2)}
.badge-inactif{background:var(--gray2);color:var(--text4);border:1px solid var(--gray3)}
.account-zone{font-size:10px;color:var(--text3);font-family:var(--mono)}

/* ══════════════════════════════════
   TECH — MISSIONS QUEUE
══════════════════════════════════ */
.tech-layout{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}
@media(max-width:860px){.tech-layout{grid-template-columns:1fr}}
.mission-queue{background:#fff;border:1px solid var(--gray3);border-radius:12px;overflow:hidden}
.mq-hdr{padding:10px 14px;background:var(--gray);border-bottom:1px solid var(--gray3);display:flex;align-items:center;justify-content:space-between}
.mq-title{font-size:11px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.8px;font-family:var(--mono)}
.mq-count{font-size:10px;font-family:var(--mono);background:var(--blue-lt);border:1px solid rgba(0,48,135,.2);color:var(--blue);padding:2px 7px;border-radius:4px}
.mission-item{padding:11px 14px;border-bottom:1px solid var(--gray2);cursor:pointer;transition:background .15s;display:flex;align-items:center;gap:10px}
.mission-item:last-child{border-bottom:none}
.mission-item:hover{background:var(--gray)}
.mission-item.active-item{background:var(--blue-lt);border-left:3px solid var(--blue)}
.mission-item.done-item{opacity:.5}
.mi-ref{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--text)}
.mi-meta{font-size:10px;color:var(--text4)}
.mi-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.no-missions-msg{padding:24px;text-align:center;color:var(--text4);font-size:12px;font-family:var(--mono)}

/* Mission detail */
.mission-detail{background:#fff;border:1px solid var(--gray3);border-radius:12px;overflow:hidden}
.md-hdr{padding:14px 18px;background:var(--gray);border-bottom:1px solid var(--gray3)}
.md-label{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text4);margin-bottom:3px}
.md-ref{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-.4px}
.md-sub{font-size:11px;color:var(--text3);margin-top:3px;font-family:var(--mono)}
.md-body{padding:16px 18px}
.md-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.md-field{background:var(--gray);border:1px solid var(--gray3);border-radius:var(--radius);padding:9px 12px}
.md-field-l{font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.8px;margin-bottom:2px}
.md-field-v{font-size:12px;font-weight:600;color:var(--text);font-family:var(--mono)}
.md-note{background:var(--yellow-lt);border:1px solid rgba(245,158,11,.3);border-radius:var(--radius);padding:9px 13px;font-size:12px;color:var(--yellow);margin-bottom:14px}
.md-note-l{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--yellow);margin-bottom:3px;opacity:.8}
.md-actions{display:flex;gap:8px;flex-wrap:wrap}
.btn-start{padding:10px 18px;border-radius:var(--radius);background:linear-gradient(135deg,#1A7C3E,#10B981);border:none;color:#fff;font-family:'Syne',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:all .2s}
.btn-start:hover{opacity:.9;box-shadow:0 4px 14px rgba(26,124,62,.3)}
.btn-done{padding:10px 18px;border-radius:var(--radius);background:var(--green-lt);border:1.5px solid rgba(26,124,62,.3);color:var(--green);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}
.btn-done:hover{background:rgba(26,124,62,.18);border-color:var(--green)}
.no-sel-msg{padding:48px 20px;text-align:center;color:var(--text4)}

/* Tech divider */
.tech-divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text4);font-size:11px;font-family:var(--mono)}
.tech-divider::before,.tech-divider::after{content:'';flex:1;height:1px;background:var(--gray3)}

/* ══════════════════════════════════
   AUDIT EMBED (PM + PBO)
══════════════════════════════════ */
.audit-embed{background:#fff;border:1px solid var(--gray3);border-radius:12px;overflow:hidden}
.ae-hdr{padding:10px 14px;background:var(--gray);border-bottom:1px solid var(--gray3);display:flex;align-items:center;justify-content:space-between}
.ae-title{font-size:11px;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.8px;font-family:var(--mono)}
.ae-tabs{display:flex;gap:2px}
.ae-tab{padding:5px 12px;border-radius:5px;border:none;background:transparent;color:var(--text3);font-family:'Syne',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.ae-tab.active{background:#fff;color:var(--blue);border:1px solid var(--gray3)}
.ae-tab:hover:not(.active){color:var(--text)}
.ae-body{padding:18px}
.ae-page{display:none}.ae-page.active{display:block}

/* Cabinet PM */
.cabinet{border:1px solid var(--gray3);border-radius:10px;background:#fff;overflow:hidden}
.cabinet-hdr{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;border-bottom:1px solid var(--gray3);background:var(--gray)}
.cabinet-title{font-size:11px;font-weight:700;color:var(--text);font-family:var(--mono);letter-spacing:.3px}
.btn-sm{font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid var(--gray3);background:#fff;color:var(--text3);cursor:pointer;font-family:'Syne',sans-serif;font-weight:600;transition:all .15s}
.btn-sm:hover{color:var(--blue);border-color:var(--blue)}
.cabinet-body{padding:8px;display:flex;flex-direction:column;gap:5px}

/* Tablet & mobile : reduce header sizes for compactness */
@media (max-width: 1024px) {
  .cabinet-hdr{padding:8px 10px;flex-wrap:wrap;gap:6px}
  .cabinet-title{font-size:10px;letter-spacing:.2px;flex:1 1 100%;margin-bottom:4px}
  .cabinet-hdr > div{display:flex;gap:4px;flex-wrap:wrap;width:100%}
  .btn-sm{font-size:10px;padding:4px 8px}
  .t-name{font-size:11px!important}
  .t-meta{font-size:9px!important}
  .t-arrow{font-size:11px!important}
  /* Compact stat cards for tablet */
  .stats-row{gap:6px;margin:10px 0}
  .sc{padding:7px 10px;min-width:0;flex:1 1 calc(33.33% - 4px)}
  .sc-l{font-size:8px;letter-spacing:.5px}
  .sc-v{font-size:16px;letter-spacing:-.5px}
}

@media (max-width: 640px) {
  .cabinet-hdr{padding:6px 8px}
  .cabinet-title{font-size:9px}
  .btn-sm{font-size:9px;padding:3px 6px}
}

.tiroir{background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);overflow:hidden}
.tiroir-hdr{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;cursor:pointer;user-select:none;background:var(--gray)}
.tiroir-hdr:hover{background:var(--gray2)}
.t-name{font-size:11px;font-weight:700;font-family:var(--mono);color:var(--text)}
.t-meta{font-size:10px;color:var(--text4);margin-left:8px}
.t-arrow{font-size:9px;color:var(--text4);transition:transform .2s;margin-left:8px}
.t-arrow.open{transform:rotate(180deg)}
.tiroir-body{display:none;padding:8px 10px 10px}.tiroir-body.open{display:block}
.grid-scroll{overflow-x:auto}
.grid-col-hdr{display:flex;margin-left:20px;gap:2px;margin-bottom:3px}
.ch{font-size:8px;color:var(--text4);text-align:center;font-family:var(--mono);flex-shrink:0}
.g-row{display:flex;align-items:center;gap:2px;margin-bottom:2px}
.rl{font-size:9px;font-weight:700;color:var(--text4);width:18px;text-align:right;padding-right:2px;flex-shrink:0;font-family:var(--mono)}
.cell{border-radius:3px;border:1px solid;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:6.5px;font-weight:700;transition:transform .1s;flex-shrink:0;font-family:var(--mono)}
.cell.hs{outline:2px solid #A32D2D;outline-offset:1px;position:relative;z-index:1}
.cell.hs::after{content:'⚠';position:absolute;top:-6px;right:-6px;width:14px;height:14px;display:flex;align-items:center;justify-content:center;background:#A32D2D;color:#fff;border-radius:50%;font-size:9px;font-weight:700;border:1.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.cell.ok-audit{outline:2px solid #1A7C3E;outline-offset:1px;position:relative;z-index:1}
.cell.ok-audit::after{content:'✓';position:absolute;top:-6px;right:-6px;width:14px;height:14px;display:flex;align-items:center;justify-content:center;background:#1A7C3E;color:#fff;border-radius:50%;font-size:9px;font-weight:700;border:1.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.cell.hs-selectable{cursor:pointer}
.cell.hs-selectable:hover{transform:scale(1.15);transition:transform .15s}
.cell.hs-selected{outline:3px solid #F59E0B;outline-offset:2px;z-index:2}

/* Tablet optimization for HS mode */
@media (max-width: 1024px) {
  /* Bigger cells for touch */
  .cell.hs-selectable{min-width:32px!important;min-height:32px!important}
  /* Empty cells must match the size to keep alignment */
  body.hs-mode .cell-empty{min-width:32px!important;min-height:32px!important}
  body.hs-mode .cell{min-width:32px!important;min-height:32px!important}
  .cell.hs::after,.cell.ok-audit::after{font-size:14px}
  /* Modal full-width on tablet */
  #hs-modal-overlay > div{max-width:90vw!important}
  /* Larger buttons in modal */
  #hs-modal-overlay button{min-height:48px;font-size:14px!important}
  /* Bigger select & textarea */
  #hs-motif,#hs-note{font-size:14px!important;min-height:44px!important}
  #hs-note{min-height:80px!important}
  /* Batch bar bigger for tablet */
  #hs-batch-bar{padding:18px 20px!important}
  #hs-batch-bar select,#hs-batch-bar button{min-height:44px;font-size:13px!important;padding:10px 14px!important}
}

/* Touch-specific */
@media (hover: none) and (pointer: coarse) {
  .cell.hs-selectable:active{transform:scale(0.92);transition:transform .1s}
  .cell.hs-selectable{touch-action:manipulation}
}


.cell:hover{transform:scale(1.4);z-index:10;position:relative}
.cell.libre{background:rgba(26,124,62,.1);border-color:rgba(26,124,62,.3);color:var(--green)}
.cell.orange{background:rgba(249,115,22,.12);border-color:rgba(249,115,22,.4);color:#EA580C}
.cell.bleu{background:rgba(0,48,135,.1);border-color:rgba(0,48,135,.3);color:var(--blue)}
.cell.vert{background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.35);color:#16A34A}
.cell.rouge{background:rgba(226,0,26,.1);border-color:rgba(226,0,26,.3);color:var(--red)}
.cell.violet{background:rgba(139,92,246,.12);border-color:rgba(139,92,246,.35);color:#7C3AED}
.cell.jaune{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.4);color:#B45309}
.cell.blanc{background:rgba(148,163,184,.1);border-color:rgba(148,163,184,.3);color:#64748B}
.cell.noir{background:rgba(55,65,81,.12);border-color:rgba(55,65,81,.4);color:#374151}
.cell.turquoise{background:rgba(6,182,212,.1);border-color:rgba(6,182,212,.35);color:#0891B2}
.cell.rose{background:rgba(236,72,153,.1);border-color:rgba(236,72,153,.3);color:#BE185D}
.prog-bar{height:2px;background:var(--gray3);border-radius:2px;margin-bottom:8px;overflow:hidden}
.prog-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--blue),var(--red))}
.legend{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.leg{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3);font-family:var(--mono)}
.leg-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0}

/* PM Photo bar */
.pm-photo-bar{display:grid;grid-template-columns:1fr 200px;border:1px solid var(--gray3);border-radius:10px;overflow:hidden;margin-bottom:14px}
@media(max-width:600px){.pm-photo-bar{grid-template-columns:1fr}}
.pm-photo-left{padding:14px 16px;border-right:1px solid var(--gray3)}
.pm-photo-right{padding:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--gray)}
.photo-sec-title{font-size:11px;font-weight:700;color:var(--text);margin-bottom:8px;font-family:var(--mono)}
.photo-grid{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;min-height:16px}
.photo-empty{font-size:11px;color:var(--text4);font-family:var(--mono)}
.photo-thumb-wrap{position:relative;width:64px}
.photo-thumb{width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid var(--gray3);cursor:pointer;display:block}
.photo-thumb:hover{border-color:var(--blue)}
.photo-del{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:var(--red);border:none;color:#fff;font-size:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}
.photo-thumb-wrap:hover .photo-del{opacity:1}
.photo-name{font-size:8px;color:var(--text4);text-align:center;margin-top:3px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-family:var(--mono)}
.photo-btns{display:flex;gap:6px;flex-wrap:wrap}
.btn-photo{font-size:11px;font-weight:600;padding:5px 10px;border-radius:6px;border:1px solid var(--gray3);background:#fff;color:var(--text3);cursor:pointer;font-family:'Syne',sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:4px}
.btn-photo:hover{color:var(--blue);border-color:var(--blue);background:var(--blue-lt)}
.btn-pm-pdf{font-size:12px;font-weight:800;padding:9px 14px;border-radius:8px;border:1.5px solid rgba(0,48,135,.3);background:var(--blue-lt);color:var(--blue);cursor:pointer;font-family:'Syne',sans-serif;transition:all .2s;width:100%;text-align:center;margin-bottom:4px}
.btn-pm-pdf:hover{background:rgba(0,48,135,.15);border-color:var(--blue)}

/* PBO cards */
.pbo-card{background:#fff;border:1px solid var(--gray3);border-radius:10px;overflow:hidden;margin-bottom:8px}
.pbo-card-hdr{display:flex;align-items:center;gap:8px;padding:10px 14px;cursor:pointer;user-select:none;flex-wrap:wrap}
.pbo-card-hdr:hover{background:rgba(0,0,0,.01)}
.pbo-ref{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--text)}
.pbo-cable{font-size:10px;color:var(--text4);font-family:var(--mono)}
.tube-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;font-family:var(--mono);border:1px solid}
.pbo-actif-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;background:var(--green-lt);color:var(--green);border:1px solid rgba(26,124,62,.25)}
.pbo-card-arrow{font-size:9px;color:var(--text4);transition:transform .2s;margin-left:auto}
.pbo-card-arrow.open{transform:rotate(180deg)}
.pbo-body{display:none;border-top:1px solid var(--gray2)}.pbo-body.open{display:block}
.fibre-table{width:100%;border-collapse:collapse}
.fibre-table th{text-align:left;padding:7px 11px;font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:var(--text4);font-family:var(--mono);background:var(--gray);border-bottom:1px solid var(--gray3)}
.fibre-table td{padding:6px 11px;font-size:11px;font-family:var(--mono);border-bottom:1px solid rgba(0,0,0,.03);color:var(--text2);vertical-align:middle}
.fibre-table tr:last-child td{border-bottom:none}
.fibre-table tr:hover td{background:rgba(0,48,135,.02)}
.color-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;border:1px solid}
.color-dot{width:7px;height:7px;border-radius:50%}
.cell-input{background:var(--gray);border:1px solid var(--gray3);border-radius:4px;padding:3px 6px;color:var(--text);font-family:var(--mono);font-size:10px;outline:none}
.cell-input:focus{border-color:var(--blue)}
.color-sel{background:var(--gray);border:1px solid var(--gray3);border-radius:4px;padding:3px 5px;color:var(--text);font-family:var(--mono);font-size:10px;outline:none;cursor:pointer}
.note-inp{background:transparent;border:none;border-bottom:1px solid var(--gray3);color:var(--text);font-family:var(--mono);font-size:10px;width:110px;padding:2px 0;outline:none}
.note-inp::placeholder{color:var(--text4)}
.conf-sel{background:var(--gray);border:1px solid var(--gray3);border-radius:4px;padding:3px 6px;color:var(--text);font-family:var(--mono);font-size:10px;cursor:pointer;outline:none}
.conf-ok{border-color:rgba(26,124,62,.4);color:var(--green);background:var(--green-lt)}
.conf-mod{border-color:rgba(226,0,26,.4);color:var(--red);background:var(--red-lt)}
.conf-nv{border-color:var(--gray3);color:var(--text3)}
.btn-act{width:24px;height:24px;border-radius:5px;border:1px solid;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .15s}
.btn-edit-row{background:var(--blue-lt);border-color:rgba(0,48,135,.25);color:var(--blue)}
.btn-edit-row:hover{background:rgba(0,48,135,.18)}
.btn-save-row{background:var(--green-lt);border-color:rgba(26,124,62,.25);color:var(--green)}
.btn-save-row:hover{background:rgba(26,124,62,.18)}
.btn-del-row{background:var(--red-lt);border-color:rgba(226,0,26,.2);color:var(--red)}
.btn-del-row:hover{background:rgba(226,0,26,.15)}
.btn-add-fibre{font-size:11px;font-weight:700;padding:5px 12px;border-radius:6px;border:1px dashed rgba(0,48,135,.3);background:var(--blue-lt);color:var(--blue);cursor:pointer;font-family:'Syne',sans-serif;transition:all .15s}
.btn-add-fibre:hover{border-style:solid;border-color:var(--blue)}

/* PBO footer */
.pbo-footer{border-top:1px solid var(--gray2);display:grid;grid-template-columns:1fr 260px}
@media(max-width:700px){.pbo-footer{grid-template-columns:1fr}}
.photo-sec{padding:14px 16px;border-right:1px solid var(--gray2)}
.validate-sec{padding:16px;display:flex;flex-direction:column;align-items:stretch;justify-content:center;background:linear-gradient(135deg,#F0F9F4 0%,#E8F5E9 100%);gap:10px;border-left:1px solid var(--gray2)}
.btn-validate{
  font-size:13px;font-weight:800;padding:14px 18px;border-radius:10px;
  border:none;background:linear-gradient(135deg,#1A7C3E,#10B981);
  color:#fff;cursor:pointer;font-family:'Syne',sans-serif;
  transition:all .2s;text-align:center;line-height:1.3;width:100%;
  box-shadow:0 4px 12px rgba(26,124,62,.25);
  display:flex;align-items:center;justify-content:center;gap:8px;
  letter-spacing:.3px;text-transform:uppercase;font-size:11px;
}
.btn-validate:hover{
  transform:translateY(-1px);
  box-shadow:0 6px 18px rgba(26,124,62,.35);
  background:linear-gradient(135deg,#166934,#0EA571);
}
.btn-validate.warn{
  background:linear-gradient(135deg,#D97706,#F59E0B);
  box-shadow:0 4px 12px rgba(245,158,11,.25);
}
.btn-validate.warn:hover{
  box-shadow:0 6px 18px rgba(245,158,11,.35);
  background:linear-gradient(135deg,#B45309,#D97706);
}
.btn-validate-icon{
  width:24px;height:24px;border-radius:50%;
  background:rgba(255,255,255,.25);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;flex-shrink:0;
}
.audite-stamp{
  display:flex;align-items:center;gap:12px;
  background:linear-gradient(135deg,#F0F9F4,#DCFCE7);
  border:1.5px solid rgba(26,124,62,.4);
  border-radius:10px;padding:12px 16px;width:100%;
  box-shadow:0 2px 8px rgba(26,124,62,.1);
}
.audite-stamp-text .title{font-weight:800;font-size:11px;color:var(--green)}
.audite-stamp-text .date{font-size:9px;color:var(--text4);font-family:var(--mono);margin-top:1px}
.btn-unvalidate{margin-left:auto;font-size:10px;padding:3px 9px;border-radius:5px;border:1px solid var(--gray3);background:#fff;color:var(--text4);cursor:pointer;font-family:'Syne',sans-serif;transition:all .15s}
.btn-unvalidate:hover{color:var(--red);border-color:rgba(226,0,26,.3)}
.audit-warn{
  font-size:11px;font-weight:600;color:var(--yellow);font-family:'Syne',sans-serif;
  background:linear-gradient(135deg,#FFFBEB,#FEF3C7);
  border:1px solid rgba(245,158,11,.4);
  border-radius:8px;padding:8px 12px;text-align:center;
  display:flex;align-items:center;justify-content:center;gap:6px;
}

/* BE upload zone */
.be-upload-zone{border:2px dashed var(--gray3);border-radius:var(--radius);padding:18px;text-align:center;cursor:pointer;transition:all .2s;background:var(--gray);margin-bottom:14px}
.be-upload-zone:hover,.be-upload-zone.drag{border-color:var(--blue);background:var(--blue-lt)}

/* Rapport modal */
.rapport-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9998;display:none;overflow-y:auto;backdrop-filter:blur(4px)}
.rapport-overlay.open{display:block}
.rapport-inner{max-width:1000px;margin:32px auto;padding:0 16px 60px}
.rapport-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3);font-family:'Segoe UI',Arial,sans-serif}
.rapport-top{background:var(--blue);padding:22px 28px;display:flex;justify-content:space-between;align-items:flex-start}
.rapport-close{width:30px;height:30px;border-radius:6px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.rapport-close:hover{background:rgba(226,0,26,.2)}
.rapport-stats-bar{background:#1e2d5c;padding:12px 28px;display:grid;grid-template-columns:repeat(6,1fr);gap:0;border-bottom:1px solid rgba(255,255,255,.08)}
.rapport-body{padding:22px 28px;background:#f8fafc}
.rapport-pbo-card{background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:10px;overflow:hidden}
.rapport-pbo-hdr{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;flex-wrap:wrap;border-bottom:1px solid #f0f4fa}
.rapport-pbo-hdr:hover{background:#f8fafc}
.rapport-pbo-body{display:none;border-top:1px solid #f0f4fa}.rapport-pbo-body.open{display:block}
.rapport-pbo-arrow{font-size:9px;color:#94a3b8;transition:transform .2s;margin-left:auto}
.rapport-pbo-arrow.open{transform:rotate(180deg)}

/* Tooltip */
.tt{position:fixed;background:#fff;border:1px solid var(--gray3);border-radius:10px;padding:9px 13px;font-size:11px;pointer-events:none;z-index:9999;min-width:180px;display:none;box-shadow:0 8px 24px rgba(0,0,0,.12)}
.tt-pos{font-size:13px;font-weight:700;color:var(--text);margin-bottom:5px;font-family:var(--mono)}
.tt-r{display:flex;justify-content:space-between;gap:14px;color:var(--text3);margin:2px 0}
.tt-r span:last-child{color:var(--text);font-weight:600}
.tt-badge{display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;margin-top:4px;font-family:var(--mono)}

/* Photo modal */
.photo-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.87);display:none;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px)}
.photo-modal-overlay.open{display:flex}
.photo-modal{background:#1e2530;border:1px solid #2e3748;border-radius:12px;padding:14px;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;gap:10px}
.photo-modal img{max-width:80vw;max-height:74vh;border-radius:8px;object-fit:contain;display:block}
.photo-modal-bar{display:flex;justify-content:space-between;align-items:center;gap:12px}
.photo-modal-name{font-size:11px;color:#94a3b8;font-family:var(--mono)}
.photo-modal-close{width:28px;height:28px;border-radius:6px;border:1px solid #2e3748;background:#0a0c0f;color:#e8edf5;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}

/* Empty / loading */
.empty-state{text-align:center;padding:48px 20px;color:var(--text4)}
.empty-icon{font-size:36px;margin-bottom:12px}
.empty-title{font-size:14px;font-weight:700;color:var(--text3);margin-bottom:6px}
.empty-sub{font-size:11px;font-family:var(--mono)}
.loading-spinner{display:inline-block;width:18px;height:18px;border:2px solid rgba(0,48,135,.2);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite;margin-right:8px;vertical-align:middle}
@keyframes spin{to{transform:rotate(360deg)}}

/* Alert */
.alert{padding:10px 14px;border-radius:var(--radius);font-size:12px;font-family:var(--mono);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.alert-info{background:var(--blue-lt);border:1px solid rgba(0,48,135,.2);color:var(--blue)}
.alert-success{background:var(--green-lt);border:1px solid rgba(26,124,62,.2);color:var(--green)}
.alert-error{background:var(--red-lt);border:1px solid rgba(226,0,26,.2);color:var(--red)}
.alert-warn{background:var(--yellow-lt);border:1px solid rgba(245,158,11,.25);color:var(--yellow)}


/* ── MOBILE RESPONSIVE ── */
@media(max-width:640px){
  .main{padding:14px 10px}
  .page-title{font-size:17px}
  .page-sub{font-size:10px}
  .app-nav{padding:0 10px;height:auto;min-height:48px;flex-wrap:wrap;gap:6px;padding:6px 10px}
  .nav-logo{margin-right:8px}
  .nav-logo-name{font-size:12px}
  .nav-role-badge{font-size:9px;padding:2px 7px;margin-right:6px}
  .nav-tabs{order:3;width:100%;overflow-x:auto;padding-bottom:2px;flex-wrap:nowrap}
  .nav-tab{font-size:11px;padding:5px 10px;white-space:nowrap;flex-shrink:0}
  .nav-right{margin-left:auto;gap:6px}
  .nav-user{display:none}
  .btn-nav-sm{font-size:10px;padding:4px 8px}
  .stats-row{gap:5px}
  .sc{padding:7px 10px;min-width:0;flex:1 1 calc(50% - 5px)}
  .sc-l{font-size:8px}
  .sc-v{font-size:15px}
  /* Tech mobile layout */
  .tech-layout{grid-template-columns:1fr;gap:10px}
  .mission-queue{order:1}
  .mission-detail{order:2}
  .mq-hdr{padding:8px 12px}
  .mq-title{font-size:10px}
  .mission-item{padding:9px 12px;gap:8px}
  .mi-ref{font-size:11px}
  .mi-meta{font-size:9px}
  .md-hdr{padding:11px 14px}
  .md-ref{font-size:15px}
  .md-sub{font-size:10px}
  .md-body{padding:12px 14px}
  .md-grid{grid-template-columns:1fr 1fr;gap:7px}
  .md-field{padding:7px 10px}
  .md-field-l{font-size:8px}
  .md-field-v{font-size:11px}
  .md-note{padding:8px 11px;font-size:11px}
  .md-actions{flex-direction:column;gap:6px}
  .btn-start,.btn-done{width:100%;font-size:13px;padding:11px}
  /* PBO cards mobile */
  .audit-embed{margin:0 -4px}
  .ae-hdr{padding:8px 12px;flex-direction:column;align-items:flex-start;gap:7px}
  .ae-tabs{width:100%}
  .ae-tab{flex:1;text-align:center;font-size:11px;padding:6px 8px}
  .ae-body{padding:10px}
  .pbo-card-hdr{padding:8px 11px;gap:6px}
  .pbo-ref{font-size:11px}
  .pbo-cable,.tube-badge{font-size:9px}
  .upload-zone{padding:18px 10px}
  .pm-photo-bar{grid-template-columns:1fr}
  .pm-photo-left{padding:11px 12px;border-right:none;border-bottom:1px solid var(--gray3)}
  .pbo-footer{grid-template-columns:1fr}
  .photo-sec{border-right:none;border-bottom:1px solid var(--gray2);padding:11px 13px}
  .validate-sec{padding:11px 13px}
  .btn-validate{padding:13px;font-size:13px}
  .photo-thumb-wrap{width:54px}
  .photo-thumb{width:54px;height:54px}
  .btn-photo{font-size:11px;padding:7px 11px;flex:1;justify-content:center}
/* Tables become cards on mobile */
  .fibre-table thead{display:none}
  .fibre-table,.fibre-table tbody,.fibre-table tr,.fibre-table td{display:block;width:100%}
  .fibre-table tr{
    background:#fff;
    border:1px solid var(--gray3);
    border-radius:8px;
    margin-bottom:8px;
    padding:10px;
    position:relative;
  }
  .fibre-table tr:hover td{background:transparent}
  .fibre-table td{
    padding:4px 0;
    border:none;
    display:grid;
    grid-template-columns:90px 1fr;
    gap:8px;
    align-items:center;
    font-size:11px;
  }
  .fibre-table td:before{
    content:attr(data-label);
    font-size:9px;
    color:var(--text4);
    text-transform:uppercase;
    letter-spacing:.5px;
    font-weight:700;
    font-family:var(--mono);
  }
  .fibre-table td:first-child:before{content:'N° Fibre'}
  .fibre-table td:first-child{
    background:var(--gray);
    margin:-10px -10px 8px -10px;
    padding:8px 12px;
    border-bottom:1px solid var(--gray3);
    border-radius:8px 8px 0 0;
    grid-template-columns:1fr;
    font-weight:700;
    font-size:13px;
    color:var(--text);
  }
  .fibre-table td:last-child{
    border-top:1px solid var(--gray2);
    margin-top:6px;
    padding-top:8px;
    grid-template-columns:1fr;
    justify-items:flex-end;
  }
  .fibre-table td:last-child:before{display:none}
  .cell-input{width:100%!important}
  .note-inp{width:100%!important}
  .login-card{padding:24px 22px;margin:14px}
  .login-title{font-size:19px}
  .login-input{font-size:14px;padding:11px 13px}
  .btn-login{font-size:14px;padding:12px}
  /* Tech divider mobile */
  .tech-divider{margin:14px 0;font-size:10px}
}

::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--gray)}
::-webkit-scrollbar-thumb{background:var(--gray3);border-radius:4px}
</style>
</head>
<body>

<!-- ═══════ CONFIGURE SUPABASE ═══════ -->
<script>
// ⚠️ REMPLACER PAR VOS CLÉS SUPABASE
const SUPABASE_URL = 'https://okqedewzvmklixpttmnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcWVkZXd6dm1rbGl4cHR0bW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDIzNDEsImV4cCI6MjA5MzcxODM0MX0.MqvYeXMllC17AGU28pBSTECvMl7pIjDIV2FvAbNdh9o';
// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('SW registered:', reg.scope);
        setInterval(() => reg.update(), 60 * 60 * 1000);
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner();
              }
            });
          }
        });
      })
      .catch(err => console.warn('SW failed:', err));
  });
}

function showUpdateBanner() {
  const bnr = document.createElement('div');
  bnr.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#003087;color:#fff;padding:12px 18px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:99999;display:flex;align-items:center;gap:12px;font-family:Syne,sans-serif';
  bnr.innerHTML = '<span>🔄 Nouvelle version disponible</span><button onclick="window.location.reload()" style="background:#fff;color:#003087;border:none;padding:6px 12px;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit">Recharger</button>';
  document.body.appendChild(bnr);
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  if (document.getElementById('pwa-install-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'pwa-install-btn';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#003087,#1565C0);color:#fff;border:none;padding:12px 18px;border-radius:50px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(0,48,135,.35);z-index:9000;font-family:Syne,sans-serif;font-size:14px;display:flex;align-items:center;gap:8px';
  btn.innerHTML = '<span style="font-size:16px">📲</span> Installer l\'app';
  btn.onclick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') btn.remove();
    deferredInstallPrompt = null;
  };
  document.body.appendChild(btn);
}

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.remove();
});

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
console.log('Supabase client initialized:', SUPABASE_URL);
</script>

<!-- ═══════ LOGIN ═══════ -->
<div class="screen active" id="screen-login">
  <div style="position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(255,255,255,.04);top:-150px;left:-150px;pointer-events:none"></div>
  <div style="position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(226,0,26,.08);bottom:-80px;right:-80px;pointer-events:none"></div>
  <div class="login-card">
    <div class="login-logo">
      <div class="login-logo-sfr">SFR</div>
      <div class="login-logo-name">XP Fibre · PM Audit</div>
    </div>
    <div class="login-title">Connexion</div>
    <div class="login-sub">Plateforme de gestion des audits PM</div>
    <div class="login-error" id="login-error"></div>
    <label class="login-label">Adresse e-mail</label>
    <input class="login-input" type="email" id="login-email" placeholder="votre@email.com" autocomplete="email">
    <label class="login-label">Mot de passe</label>
    <input class="login-input" type="password" id="login-password" placeholder="••••••••" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
    <button class="btn-login" id="btn-login" onclick="doLogin()">Se connecter</button>
    <div class="login-footer">Compte géré par votre administrateur</div>
  </div>
</div>

<!-- ═══════ APP ═══════ -->
<div class="screen" id="screen-app">
  <!-- NAV -->
  <nav class="app-nav" id="app-nav">
    <div class="nav-logo" onclick="goHome()">
      <span class="nav-logo-sfr">SFR</span>
      <span class="nav-logo-name">PM Audit</span>
    </div>
    <span class="nav-role-badge" id="nav-role-badge"></span>
    <div class="nav-tabs" id="nav-tabs"></div>
    <div class="nav-right">
      <span class="nav-user" id="nav-user-name"></span>
      <button class="btn-nav-sm btn-logout" onclick="doLogout()">Déconnexion</button>
    </div>
  </nav>

  <!-- PAGES -->
  <div class="main" id="app-main">

    <!-- ── PAGE: DASHBOARD ADMIN ── -->
    <div class="page" id="page-admin-dashboard">
      <div class="page-title">Tableau de bord Administrateur</div>
      <div class="page-sub">Vue globale de la plateforme XP Fibre · SFR</div>
      <div class="stats-row" id="admin-stats"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px">
        <div class="card">
          <div class="card-hdr"><div class="card-title"><div class="card-title-bar"></div>Missions récentes</div></div>
          <div class="card-body" id="admin-recent-missions"><div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Aucune mission</div></div></div>
        </div>
        <div class="card">
          <div class="card-hdr"><div class="card-title"><div class="card-title-bar" style="background:var(--blue)"></div>Activité terrain</div></div>
          <div class="card-body" id="admin-activity"><div class="empty-state"><div class="empty-icon">🔧</div><div class="empty-title">Aucune activité</div></div></div>
        </div>
      </div>
    </div>

    <!-- ── PAGE: ADMIN COMPTES ── -->
    <div class="page" id="page-admin-comptes">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px">
        <div>
          <div class="page-title">Gestion des comptes</div>
          <div class="page-sub">Créez et gérez les accès techniciens et bureau d'études</div>
        </div>
        <button class="btn btn-primary" onclick="showCreateAccount()">+ Nouveau compte</button>
      </div>

      <!-- Créer compte form -->
      <div class="card" id="create-account-form" style="display:none;margin-bottom:20px">
        <div class="card-hdr"><div class="card-title"><div class="card-title-bar"></div>Nouveau compte utilisateur</div></div>
        <div class="card-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Prénom *</label><input class="form-input" id="ca-prenom" placeholder="Prénom"></div>
            <div class="form-group"><label class="form-label">Nom *</label><input class="form-input" id="ca-nom" placeholder="Nom"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Email *</label><input class="form-input" id="ca-email" type="email" placeholder="email@example.com"></div>
            <div class="form-group"><label class="form-label">Mot de passe *</label><input class="form-input" id="ca-password" type="password" placeholder="Min. 8 caractères"></div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Rôle *</label>
              <select class="form-select" id="ca-role">
                <option value="technicien">Technicien terrain</option>
                <option value="be">Bureau d'études</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Zone / Secteur</label><input class="form-input" id="ca-zone" placeholder="ex: Bordeaux Nord"></div>
          </div>
          <div id="create-account-msg"></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" onclick="createAccount()">Créer le compte</button>
            <button class="btn btn-ghost" onclick="hideCreateAccount()">Annuler</button>
          </div>
        </div>
      </div>

      <!-- Accounts list -->
      <div class="card">
        <div class="card-hdr">
          <div class="card-title"><div class="card-title-bar" style="background:var(--blue)"></div>Utilisateurs <span id="accounts-count" style="font-weight:400;color:var(--text4);font-size:11px;margin-left:4px"></span></div>
          <select class="form-select" id="filter-role" style="width:auto;font-size:11px;padding:4px 8px;margin-bottom:0" onchange="loadAccounts()">
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="be">BE</option>
            <option value="technicien">Technicien</option>
          </select>
        </div>
        <div class="card-body" style="padding:10px">
          <div id="accounts-list"><div class="loading-spinner"></div> Chargement...</div>
        </div>
      </div>
    </div>

    <!-- ── PAGE: BE MISSIONS ── -->
    <div class="page" id="page-be-dashboard">
      <div class="page-title">Dashboard BE</div>
      <div class="page-sub">Vue d'ensemble des missions et activité terrain en temps réel</div>
      <div class="stats-row" id="be-dashboard-stats" style="margin-top:16px"></div>
      <div class="card" style="margin-top:14px">
        <div class="card-hdr"><div class="card-title"><div class="card-title-bar" style="background:var(--blue)"></div>Activité terrain</div></div>
        <div class="card-body" id="be-activity"><div class="empty-state"><div class="empty-icon">💤</div><div class="empty-title">Aucune mission en cours</div></div></div>
      </div>
    </div>

    <div class="page" id="page-be-missions">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <div>
          <div class="page-title">Gestion des missions d'audit</div>
          <div class="page-sub">Créez et suivez les demandes envoyées aux techniciens</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:360px 1fr;gap:20px;align-items:start">
        <!-- Form -->
        <div class="card">
          <div class="card-hdr"><div class="card-title"><div class="card-title-bar"></div>Nouvelle mission</div></div>
          <div class="card-body">
            <label class="form-label">Référence PM *</label>
            <input class="form-input" id="f-ref" placeholder="ex: SRO-BPI-0004610648">
            <div class="form-row">
              <div><label class="form-label">Zone / Ville</label><input class="form-input" id="f-zone" placeholder="ex: Bordeaux"></div>
              <div>
                <label class="form-label">Type d'audit</label>
                <select class="form-select" id="f-type" onchange="togglePBOUpload()">
                  <option value="Complet">Complet (PM + PBO)</option>
                  <option value="PM">Visuel PM</option>
                  <option value="PBO">Zone arrière PBO</option>
                  <option value="HS">🔍 Audit fibres HS</option>
                  <option value="PBO0">🗺️ PBO à 0 (tournée)</option>
                </select>
              </div>
            </div>
            <label class="form-label">Technicien assigné</label>
            <select class="form-select" id="f-tech-select">
              <option value="">— Sélectionner un technicien —</option>
            </select>
            <div class="form-row">
              <div><label class="form-label">Date souhaitée</label><input class="form-input" id="f-date" type="date"></div>
              <div>
                <label class="form-label">Priorité</label>
                <div class="prio-btns">
                  <button class="prio-btn active-haute" id="pb-haute" onclick="setPrio('haute')">🔴 Haute</button>
                  <button class="prio-btn" id="pb-moyenne" onclick="setPrio('moyenne')">🟡 Moy.</button>
                  <button class="prio-btn" id="pb-basse" onclick="setPrio('basse')">🟢 Basse</button>
                </div>
              </div>
            </div>
            <label class="form-label">Instructions / Notes</label>
            <textarea class="form-textarea" id="f-note" placeholder="Ex: Vérifier les jarretières oranges du tiroir 3..."></textarea>
            <!-- PBO file upload (shown for PBO/Complet) -->
            <div id="fg-pbo-file" style="display:block">
              <label class="form-label">Fichier zone arrière (ROP/SNIF) *</label>
              <div class="be-upload-zone" id="be-pbo-dropzone" onclick="document.getElementById('be-pbo-file').click()"
                ondragover="event.preventDefault();this.classList.add('drag')"
                ondrop="beDropPBO(event)">
                <input type="file" id="be-pbo-file" accept=".csv" onchange="beParsePBO(this.files[0])" style="display:none">
                <div id="be-pbo-state">
                  <div style="font-size:22px;margin-bottom:6px">📋</div>
                  <div style="font-size:12px;font-weight:700;color:var(--text3)">Déposer le fichier ROP / SNIF CSV</div>
                  <div style="font-size:10px;color:var(--text4);margin-top:3px;font-family:var(--mono)">Le technicien recevra directement les PBO à auditer</div>
                </div>
              </div>
            </div>
            <div id="create-mission-msg"></div>
            <button class="btn btn-primary btn-full" onclick="createMission()">+ Créer la mission</button>
          </div>
        </div>
        <!-- Missions list -->
        <div>
          <div class="stats-row" id="be-stats"></div>
          

          <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
            <input style="flex:1;min-width:180px;background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:7px 12px;color:var(--text);font-family:var(--mono);font-size:12px;outline:none" placeholder="🔍 Rechercher..." id="be-search" oninput="beMissionPage=1;renderBEMissions()">
            <select style="background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:7px 10px;color:var(--text3);font-size:12px;outline:none;cursor:pointer" id="be-filter" onchange="beMissionPage=1;renderBEMissions()">
              <option value="">Tous statuts</option>
              <option value="attente">En attente</option>
              <option value="en-cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
          <div id="be-missions-list"></div>
        </div>
      </div>
    </div>

    <!-- ── PAGE: TECHNICIEN ── -->
    <div class="page" id="page-tech-missions">
      <div class="page-title">Mes missions d'audit</div>
      <div class="page-sub">Sélectionnez une mission pour démarrer l'audit sur le terrain</div>
      <div class="tech-layout" style="margin-top:16px">
        <div class="mission-queue">
          <div class="mq-hdr">
            <span class="mq-title">Mes missions</span>
            <span class="mq-count" id="tech-count">0</span>
          </div>
          <div id="tech-missions-list"><div class="no-missions-msg">Aucune mission assignée</div></div>
        </div>
        <div class="mission-detail" id="tech-detail">
          <div class="no-sel-msg">
            <div style="font-size:32px;margin-bottom:10px">👆</div>
            <div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:5px">Sélectionnez une mission</div>
            <div style="font-size:11px;font-family:var(--mono);color:var(--text4)">Cliquez sur une mission pour voir les détails et démarrer l'audit</div>
          </div>
        </div>
      </div>
      <div class="tech-divider">Outil d'audit terrain</div>
      <div class="audit-embed">
        <div class="ae-hdr">
          <span class="ae-title">Audit terrain</span>
          <div class="ae-tabs">
            <button class="ae-tab active" onclick="showAETab('pm',this)">📊 Visualiseur PM</button>
            <button class="ae-tab" onclick="showAETab('pbo',this)">🔍 Audit PBO</button>
          </div>
        </div>
        <div class="ae-body">
          <div class="ae-page active" id="ae-pm">
            <div class="upload-zone" onclick="document.getElementById('pm-file').click()"
              ondragover="event.preventDefault();this.classList.add('drag')"
              ondrop="dropPMFile(event)">
              <input type="file" id="pm-file" accept=".xlsx,.csv" onchange="loadPMFile(this.files[0])" style="display:none">
              <div style="font-size:26px;margin-bottom:8px">📂</div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">Déposer le fichier PM ici</div>
              <div style="font-size:11px;color:var(--text3);margin-top:4px;font-family:var(--mono)">Formats : .xlsx · .csv — Tiroir, Position, Couleur Jarretiere, SSN</div>
            </div>
            <div id="pm-result" style="display:none">
              <div id="pm-file-pill" class="file-pill" style="display:flex;align-items:center;gap:8px;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">✅ <span id="pm-fname"></span></div>
                <div style="display:flex;gap:5px;flex-shrink:0">
                  <button onclick="document.getElementById('pm-file').click()" style="font-size:10px;padding:4px 9px;border-radius:5px;border:1px solid var(--gray3);background:#fff;color:var(--text3);cursor:pointer;font-family:'Syne',sans-serif;font-weight:600" title="Changer le fichier">🔄 Changer</button>
                  <button onclick="clearPM()" style="font-size:10px;padding:4px 9px;border-radius:5px;border:1px solid rgba(226,0,26,.3);background:var(--red-lt);color:var(--red);cursor:pointer;font-family:'Syne',sans-serif;font-weight:600" title="Supprimer le fichier">🗑️ Supprimer</button>
                </div>
              </div>
              <div class="stats-row" id="pm-stats"></div>
              <div class="legend" id="pm-legend"></div>
              <div class="pm-photo-bar">
                <div class="pm-photo-left">
                  <div class="photo-sec-title">📷 Photos de l'armoire PM</div>
                  <div class="photo-grid" id="pm-pgrid"><div class="photo-empty">Aucune photo</div></div>
                  <div class="photo-btns" style="margin-top:8px">
                    <label class="btn-photo">📁 Choisir<input type="file" accept="image/*" multiple onchange="addPMPhotos(this.files)" style="display:none"></label>
                    <label class="btn-photo">📸 Photo<input type="file" accept="image/*" capture="environment" onchange="addPMPhotos(this.files)" style="display:none"></label>
                  </div>
                </div>
                <div class="pm-photo-right">
                  <button class="btn-pm-pdf" onclick="exportPMPDF()">📄 Rapport PDF</button>
                  <div style="font-size:10px;color:var(--text4);margin-top:4px;text-align:center;font-family:var(--mono)">Grille + photos</div>
                </div>
              </div>

              <div class="cabinet">
                <div class="cabinet-hdr">
                  <span class="cabinet-title" id="pm-cab-title">ARMOIRE PM</span>
                  <div style="display:flex;gap:6px">
                    <button id="btn-csv-all-hs" class="btn-sm" style="display:none;background:var(--blue);color:#fff;border-color:var(--blue);font-weight:700" onclick="exportAllHSCSV()">⬇ Export CSV global</button>
                    <button class="btn-sm" onclick="pmAll(true)">Tout ouvrir</button>
                    <button class="btn-sm" onclick="pmAll(false)">Tout fermer</button>
                  </div>
                </div>
                <div class="cabinet-body" id="pm-body"></div>
              </div>

              <!-- ═══ COMMANDES MODULE ═══ -->
              <div id="cmd-module" style="margin-bottom:14px">
                <div style="font-size:11px;color:var(--blue-mid);margin:0 0 8px;font-family:var(--mono);letter-spacing:.5px;font-weight:600;text-transform:uppercase">━━ Analyse commandes opérateurs ━━</div>
                <div id="cmd-empty" style="border:2px dashed rgba(0,48,135,.3);border-radius:10px;padding:18px;text-align:center;background:var(--blue-lt);cursor:pointer" onclick="document.getElementById('cmd-file').click()"
                  ondragover="event.preventDefault();this.style.background='#CCDDF7'"
                  ondragleave="this.style.background='var(--blue-lt)'"
                  ondrop="dropCmdFile(event)">
                  <input type="file" id="cmd-file" accept=".xlsx" onchange="loadCmdFile(this.files[0])" style="display:none">
                  <div style="font-size:24px;margin-bottom:6px">📊</div>
                  <div style="font-size:13px;font-weight:600;color:var(--blue);margin-bottom:4px">Charger le fichier des commandes opérateurs (A5)</div>
                  <div style="font-size:11px;color:var(--blue);opacity:.7;font-family:var(--mono)">Format Excel (.xlsx) — pour comparer avec les jarretières du terrain</div>
                </div>
                <div id="cmd-result" style="display:none">
                  <div class="file-pill" style="display:flex;align-items:center;gap:8px;justify-content:space-between;margin-bottom:14px">
                    <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">✅ <span id="cmd-fname"></span></div>
                    <button onclick="clearCmd()" style="font-size:10px;padding:4px 9px;border-radius:5px;border:1px solid rgba(226,0,26,.3);background:var(--red-lt);color:var(--red);cursor:pointer;font-family:'Syne',sans-serif;font-weight:600">🗑️ Supprimer</button>
                  </div>
                  <div style="font-size:12px;font-weight:600;color:var(--text3);margin:0 0 8px;letter-spacing:.5px;text-transform:uppercase">Comparatif terrain vs commandes</div>
                  <div id="cmd-comparatif" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px"></div>
                  <div id="cmd-alert" style="display:none;background:var(--yellow-lt);border:1px solid rgba(245,158,11,.3);border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:12px;font-weight:600;color:var(--yellow)"></div>
                  <div id="cmd-details"></div>
                  <div id="cmd-actions" style="display:none;gap:8px">
                    <button onclick="exportPMPDF()" style="flex:1;padding:10px;background:var(--blue);color:#fff;border:none;border-radius:var(--radius);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer">📄 Export rapport PDF complet (PM + surplus)</button>
                    <button onclick="exportCmdCSV()" style="flex:1;padding:10px;background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);font-family:'Syne',sans-serif;font-size:12px;font-weight:600;cursor:pointer">⬇ Export CSV surplus</button>
                  </div>
                </div>
              </div>

              
            </div>
            <div id="pm-empty" style="text-align:center;padding:24px;color:var(--text4);font-size:12px;font-family:var(--mono)">Déposez un fichier PM ci-dessus</div>
          </div>
          <div class="ae-page" id="ae-pbo">
            <div id="pbo-no-mission" style="text-align:center;padding:36px;color:var(--text4)">
              <div style="font-size:34px;margin-bottom:10px">📋</div>
              <div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:6px">Aucune mission PBO active</div>
              <div style="font-size:11px;font-family:var(--mono);line-height:1.7;max-width:340px;margin:0 auto">Sélectionnez une mission de type <b style="color:var(--blue)">Zone arrière PBO</b> ou <b style="color:var(--blue)">Complet</b>.<br>Le fichier est chargé automatiquement.</div>
            </div>
            <div id="pbo-result" style="display:none">
              <div class="file-pill" style="display:flex;align-items:center;gap:8px;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">✅ <span id="pbo-fname"></span></div>
              </div>
              <div class="stats-row" id="pbo-stats"></div>
              <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
                <input style="flex:1;min-width:160px;background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:7px 12px;color:var(--text);font-family:var(--mono);font-size:12px;outline:none" placeholder="🔍 Rechercher..." id="pbo-search" oninput="filterPBOs()">
                <select style="background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:7px 10px;color:var(--text3);font-size:12px;outline:none" id="pbo-fconf" onchange="filterPBOs()">
                  <option value="">Toutes conformités</option>
                  <option value="Conforme">✅ Conforme</option>
                  <option value="A modifier">⚠️ À modifier</option>
                  <option value="Non verifie">⬜ Non vérifié</option>
                </select>
                <select style="background:#fff;border:1px solid var(--gray3);border-radius:var(--radius);padding:7px 10px;color:var(--text3);font-size:12px;outline:none" id="pbo-faudit" onchange="filterPBOs()">
                  <option value="">Tous statuts</option>
                  <option value="audite">✅ Audités</option>
                  <option value="pending">⏳ En attente</option>
                </select>
                <button style="padding:7px 14px;border-radius:var(--radius);background:var(--blue);border:none;color:#fff;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer" onclick="exportCSV()">⬇ CSV</button>
                <button style="padding:7px 14px;border-radius:var(--radius);background:var(--red);border:none;color:#fff;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;cursor:pointer" onclick="exportPDF()">📄 PDF</button>
              </div>
              <div id="pbo-count" style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:10px"></div>
              <div id="pbo-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PAGE: RAPPORT BE ── -->
    <div class="page" id="page-be-rapports">
      <div class="page-title">Rapports d'audit</div>
      <div class="page-sub">Consultez les rapports terrain des techniciens</div>
      <div id="be-rapports-list" style="margin-top:16px"></div>
    </div>

  </div>
</div>

<!-- ═══════ RAPPORT MODAL ═══════ -->
<div class="rapport-overlay" id="rapport-overlay" onclick="if(event.target===this)document.getElementById('rap-overlay').remove()">
  <div class="rapport-inner"><div class="rapport-card" id="rapport-modal"></div></div>
</div>

<!-- ═══════ TOOLTIP ═══════ -->
<div class="tt" id="tt">
  <div class="tt-pos" id="tt-pos"></div>
  <div class="tt-r"><span>SSN</span><span id="tt-ssn"></span></div>
  <div><span class="tt-badge" id="tt-badge"></span></div>
</div>

<!-- ═══════ PHOTO MODAL ═══════ -->
<div class="photo-modal-overlay" id="photo-modal" onclick="if(event.target===this)closeModal()">
  <div class="photo-modal">
    <div class="photo-modal-bar">
      <span class="photo-modal-name" id="modal-name"></span>
      <button class="photo-modal-close" onclick="closeModal()">✕</button>
    </div>
    <img id="modal-img" src="" alt="Photo">
  </div>
</div>

<script>
'use strict';

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let currentUser = null;   // { id, email, nom, prenom, role, zone }
let missions = [];        // missions chargées
let allUsers = [];        // tous les utilisateurs (admin seulement)
let selectedMissionId = null;
let pboData = [];
const pboPhotos = {};
let pmData = null;
let hsFibres = {}; // HS audit data: {tNum_pos: {fibre_HS, motif, note, ...}}
let hsSelected = new Set(); // batch mode selection
let isHSMode = false;
let batchModeOn = false; // True when user is selecting multiple cells
const HS_MOTIFS = ['Cas 1 : Fibre coupée/cassée','Cas 2 : MAJ SI à faire','Cas 3 : Pas de continuité','Autre'];
let pmPhotos = [];
let selectedPrio = 'haute';
let bePBOParsed = null;
let bePBOFileName = '';

// ══════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('btn-login');
  if (!email || !password) { showLoginError('Veuillez remplir tous les champs.'); return; }
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner"></span>Connexion...';
  errEl.classList.remove('show');
  try {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('Auth OK, user:', data.user.id);
    // Try to load profile, but don't block login if it fails
    try {
      await loadCurrentUser(data.user.id);
    } catch(profileErr) {
      console.warn('Profile load failed, using default admin:', profileErr);
      currentUser = { id: data.user.id, email: data.user.email, nom: 'Admin', prenom: '', role: 'admin', actif: true };
    }
    enterApp();
  } catch (err) {
    showLoginError(err.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Se connecter';
  }
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.add('show');
}

async function doLogout() {
  await sb.auth.signOut();
  currentUser = null; missions = []; pboData = [];
  document.getElementById('screen-login').classList.add('active');
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
}

async function loadCurrentUser(uid) {
  console.log('Loading profile for uid:', uid);
  // Try with maybeSingle to handle RLS gracefully
  const { data, error } = await sb.from('profiles').select('*').eq('id', uid).maybeSingle();
  console.log('Profile result:', data, 'Error:', error);
  if (error) {
    console.error('Profile error:', error);
    throw new Error('Erreur profil: ' + error.message);
  }
  if (!data) {
    // RLS might be blocking - try to get profile via a different approach
    console.log('Profile null - trying without RLS check...');
    // Create a minimal profile from auth data
    currentUser = { id: uid, email: '', nom: 'Admin', prenom: '', role: 'admin', actif: true };
    return;
  }
  if (!data.actif) throw new Error('Ce compte est désactivé.');
  currentUser = data;
}

// ══════════════════════════════════════════════
// APP INIT
// ══════════════════════════════════════════════
function enterApp() {
  console.log('enterApp called with user:', currentUser);
  console.log('screen-app element:', document.getElementById('screen-app'));
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-app').classList.add('active');
  const nameEl = document.getElementById('nav-user-name');
  if(nameEl) nameEl.textContent = (currentUser.prenom||'') + ' ' + (currentUser.nom||'');
  setupNav();
  // Load data async without blocking
  setTimeout(() => {
    loadAppData().catch(err => console.error('loadAppData failed:', err));
  }, 100);
}

function setupNav() {
  const role = currentUser.role;
  const badge = document.getElementById('nav-role-badge');
  badge.textContent = role === 'admin' ? 'Administrateur' : role === 'be' ? "Bureau d'études" : 'Technicien';
  const tabs = document.getElementById('nav-tabs');
  tabs.innerHTML = '';
  if (role === 'admin') {
    addTab(tabs, 'admin-dashboard', '📊 Dashboard');
    addTab(tabs, 'admin-comptes', '👥 Comptes');
    addTab(tabs, 'be-missions', '📋 Missions');
    addTab(tabs, 'be-rapports', '📄 Rapports');
  } else if (role === 'be') {
    addTab(tabs, 'be-dashboard', '📊 Dashboard');
    addTab(tabs, 'be-missions', '📋 Missions');
    addTab(tabs, 'be-rapports', '📄 Rapports');
  } else {
    addTab(tabs, 'tech-missions', '🔧 Mes missions');
  }
}

function addTab(container, page, label) {
  const btn = document.createElement('button');
  btn.className = 'nav-tab';
  btn.textContent = label;
  btn.dataset.page = page;
  btn.onclick = () => showPage(page, btn);
  container.appendChild(btn);
}

function showPage(pageId, btn) {
  console.log('showPage:', pageId);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const pageEl = document.getElementById('page-' + pageId);
  if (pageEl) pageEl.classList.add('active');
  if (btn) btn.classList.add('active');
  else document.querySelector('[data-page="' + pageId + '"]')?.classList.add('active');
  // Render specific page content
  if (pageId === 'be-rapports') renderBERapports();
}

function renderBERapports() {
  const listEl = document.getElementById('be-rapports-list');
  if (!listEl) return;
  // Show only missions that have PBO data and at least some audit work
  const withReports = missions.filter(m => 
    m.pbo_data && m.pbo_data.length > 0 && 
    m.pbo_data.some(p => p.audite || p.fibres?.some(f => f.conformite !== 'Non verifie'))
  );
  if (!withReports.length) {
    listEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">Aucun rapport disponible</div><div class="empty-sub">Les rapports apparaîtront ici une fois les audits commencés</div></div>';
    return;
  }
  listEl.innerHTML = withReports.map(m => {
    const pboList = m.pbo_data || [];
    const audites = pboList.filter(p => p.audite).length;
    const totalF = pboList.reduce((s,p)=>s+(p.fibres?.length||0),0);
    const conf = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='Conforme').length||0),0);
    const amod = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='A modifier').length||0),0);
    const pct = pboList.length > 0 ? Math.round(audites/pboList.length*100) : 0;
    const techName = m.tech ? m.tech.prenom + ' ' + m.tech.nom : 'Non assigné';
    const sc = m.statut === 'attente' ? 'attente' : m.statut === 'en-cours' ? 'en-cours' : 'termine';
    const sl = m.statut === 'attente' ? 'En attente' : m.statut === 'en-cours' ? 'En cours' : 'Terminé';
    return `<div class="mission-card" style="cursor:pointer" onclick="openRapport('${m.id}')">
      <div class="mc-hdr">
        <div class="mc-ref">${m.ref_pm}</div>
        <span class="mc-status ${sc}">${sl}</span>
        <span style="font-size:10px;color:var(--text4);font-family:var(--mono);margin-left:auto">📍 ${m.zone||'—'}</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:12px 0">
        <div style="text-align:center"><div style="font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">Avancement</div><div style="font-size:18px;font-weight:800;color:${pct===100?'var(--green)':'var(--blue)'};margin-top:2px">${pct}%</div></div>
        <div style="text-align:center"><div style="font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">PBO Aud.</div><div style="font-size:18px;font-weight:800;color:var(--text);margin-top:2px">${audites}/${pboList.length}</div></div>
        <div style="text-align:center"><div style="font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">Fibres</div><div style="font-size:18px;font-weight:800;color:var(--text);margin-top:2px">${totalF}</div></div>
        <div style="text-align:center"><div style="font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">Conformes</div><div style="font-size:18px;font-weight:800;color:var(--green);margin-top:2px">${conf}</div></div>
        <div style="text-align:center"><div style="font-size:9px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">À modifier</div><div style="font-size:18px;font-weight:800;color:${amod>0?'var(--red)':'var(--text4)'};margin-top:2px">${amod}</div></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--gray2)">
        <div style="font-size:11px;color:var(--text3);font-family:var(--mono)">👤 ${techName} · ${new Date(m.created_at).toLocaleDateString('fr-FR')}</div>
        <button class="btn btn-primary" style="font-size:11px;padding:5px 12px">📊 Voir le rapport →</button>
      </div>
    </div>`;
  }).join('');
}

function goHome() {
  const role = currentUser?.role;
  if (!role) return;
  const defaultPage = role === 'admin' ? 'admin-dashboard' : role === 'be' ? 'be-dashboard' : 'tech-missions';
  showPage(defaultPage, document.querySelector(`[data-page="${defaultPage}"]`));
}

async function loadAppData() {
  const role = currentUser.role;
  try {
    if (role === 'admin') {
      await loadMissions();
      await loadAccounts();
      await loadTechniciens();
      await loadAdminDashboard();
      showPage('admin-dashboard', document.querySelector('[data-page="admin-dashboard"]'));
    } else if (role === 'be') {
      await loadMissions();
      await loadTechniciens();
      await loadBEDashboard();
      showPage('be-dashboard', document.querySelector('[data-page="be-dashboard"]'));
      renderBEMissions();
    } else {
      await loadMyMissions();
      showPage('tech-missions', document.querySelector('[data-page="tech-missions"]'));
      // Hide PM file pill for technicien (file is auto-loaded)
      setTimeout(()=>{
        const pill=document.getElementById('pm-file-pill');
        if(pill)pill.style.display='none';
      },100);
    }
  } catch(err) {
    console.error('loadAppData error:', err);
    // Show the app anyway even if data loading fails
    if (role === 'admin') showPage('admin-dashboard', document.querySelector('[data-page="admin-dashboard"]'));
    else if (role === 'be') showPage('be-dashboard', document.querySelector('[data-page="be-dashboard"]'));
    else showPage('tech-missions', document.querySelector('[data-page="tech-missions"]'));
  }
}

// ══════════════════════════════════════════════
// DATA LOADING
// ══════════════════════════════════════════════
async function loadMissions() {
  const { data, error } = await sb.from('missions')
    .select('*, be:be_id(nom,prenom), tech:tech_id(nom,prenom), pbo_data(id,reference_pbo,couleur_tube,cable,audite,audite_date,fibres(*))')
    .order('created_at', { ascending: false });
  if (!error) missions = data || [];
  renderBEMissions();
  renderBEStats();
}

async function loadMyMissions() {
  const { data, error } = await sb.from('missions')
    .select('*, be:be_id(nom,prenom), pbo_data(id,reference_pbo,couleur_tube,cable,audite,audite_date,fibres(*))')
    .eq('tech_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (!error) missions = data || [];
  renderTechMissions();
}

async function loadAccounts() {
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  if (!error) { allUsers = data || []; renderAccounts(); }
}

let techniciens = [];
async function loadTechniciens() {
  const { data } = await sb.from('profiles').select('id,nom,prenom').eq('role', 'technicien').eq('actif', true);
  techniciens = data || [];
  const sel = document.getElementById('f-tech-select');
  if (sel) {
    sel.innerHTML = '<option value="">— Sélectionner un technicien —</option>';
    techniciens.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.prenom + ' ' + u.nom;
      sel.appendChild(opt);
    });
  }
}

// ══════════════════════════════════════════════
// ADMIN DASHBOARD
// ══════════════════════════════════════════════
async function loadAdminDashboard() {
  await loadMissions();
  const total = missions.length;
  const attente = missions.filter(m => m.statut === 'attente').length;
  const encours = missions.filter(m => m.statut === 'en-cours').length;
  const termine = missions.filter(m => m.statut === 'termine').length;
  document.getElementById('admin-stats').innerHTML =
    scCard('Missions', total, 'var(--blue)') + scCard('En attente', attente, '#B45309') +
    scCard('En cours', encours, 'var(--blue)') + scCard('Terminées', termine, 'var(--green)') +
    scCard('Utilisateurs', allUsers.length, '#7C3AED');
  // Recent missions (paginées)
  renderAdminMissions();
  
  // Activité terrain
  renderActivityFeed('admin-activity');
}

let adminMissionPage = 1;
function setAdminPage(p) {
  adminMissionPage = p;
  renderAdminMissions();
}
function renderAdminMissions() {
  const el = document.getElementById('admin-recent-missions');
  if (!el) return;
  if (!missions.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">Aucune mission</div></div>';
    return;
  }
  const totalPages = Math.ceil(missions.length / PAGE_SIZE);
  if (adminMissionPage > totalPages) adminMissionPage = totalPages;
  if (adminMissionPage < 1) adminMissionPage = 1;
  const startIdx = (adminMissionPage - 1) * PAGE_SIZE;
  const shown = missions.slice(startIdx, startIdx + PAGE_SIZE);
  const pageInfo = `<div style="font-size:10px;color:var(--text4);text-align:center;margin-top:6px;font-family:var(--mono)">${missions.length} mission${missions.length>1?'s':''} au total</div>`;
  el.innerHTML = shown.map(m => missionRow(m)).join('') + renderPagination(adminMissionPage, missions.length, 'setAdminPage') + pageInfo;
}

async function loadBEDashboard() {
  await loadMissions();
  const total = missions.length;
  const attente = missions.filter(m => m.statut === 'attente').length;
  const encours = missions.filter(m => m.statut === 'en-cours').length;
  const termine = missions.filter(m => m.statut === 'termine').length;
  const statsEl = document.getElementById('be-dashboard-stats');
  if (statsEl) {
    statsEl.innerHTML = scCard('Missions', total, 'var(--blue)') + scCard('En attente', attente, '#B45309') +
      scCard('En cours', encours, 'var(--blue)') + scCard('Terminées', termine, 'var(--green)');
  }
  renderActivityFeed('be-activity');
}


function renderActivityFeed(targetElId) {
  const activeMissions = missions.filter(m => m.statut === 'en-cours');
  const activityEl = document.getElementById(targetElId);
  if (!activityEl) return;
  if (activeMissions.length === 0) {
    activityEl.innerHTML = '<div class="empty-state"><div class="empty-icon">💤</div><div class="empty-title">Aucune mission en cours</div><div style="font-size:11px;color:var(--text4);margin-top:6px;font-family:var(--mono)">Les techniciens actifs apparaîtront ici</div></div>';
  } else {
    activityEl.innerHTML = activeMissions.map(m => {
      const tech = m.tech || {};
      const techName = (tech.prenom || '') + ' ' + (tech.nom || '') || 'Non assigné';
      const isHS = m.type_audit === 'HS';
      const isPBO0 = m.type_audit === 'PBO0';
      const pbo0Arrets = isPBO0 ? (m.pm_data?.pbo0_arrets || []) : [];
      const pbo0Total = pbo0Arrets.length;
      const pbo0Traites = pbo0Arrets.filter(a => a.terrain && a.terrain.statut).length;
      const totalFibres = m.pbo_data?.reduce((s,p)=>s+(p.fibres?.length||0),0) || 0;
      const conformes = m.pbo_data?.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='Conforme').length||0),0) || 0;
      const totalPbo = m.pbo_data?.length || 0;
      const auditesPbo = m.pbo_data?.filter(p => p.audite).length || 0;
      const auditesHS = isHS ? Object.keys(m.hs_fibres||{}).length : 0;
      const pct = isPBO0
        ? (pbo0Total > 0 ? Math.round(pbo0Traites/pbo0Total*100) : 0)
        : isHS 
          ? (totalFibres > 0 ? Math.round(auditesHS/totalFibres*100) : 0)
          : (totalPbo > 0 ? Math.round(auditesPbo/totalPbo*100) : 0);
      const startDate = m.date_demarrage ? new Date(m.date_demarrage).toLocaleDateString('fr-FR') : '—';
      return `<div style="background:#fff;border:1px solid var(--gray3);border-left:3px solid var(--blue);border-radius:8px;padding:14px 16px;margin-bottom:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--blue);animation:pulse 2s infinite"></span>
            <span style="font-family:var(--mono);font-weight:700;font-size:13px;color:var(--text)">${m.ref_pm}</span>
            <span style="font-size:10px;padding:2px 8px;background:var(--blue-lt);color:var(--blue);border-radius:4px;font-family:var(--mono);font-weight:700">${m.type_audit||'—'}</span>
          </div>
          <div style="font-size:10px;color:var(--text4);font-family:var(--mono)">depuis ${startDate}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--text3)">
          <span style="display:flex;align-items:center;gap:4px"><span style="font-size:14px">👤</span><strong style="color:var(--text)">${techName}</strong></span>
          ${m.zone ? `<span style="display:flex;align-items:center;gap:4px"><span>📍</span>${m.zone}</span>` : ''}
        </div>
        ${totalPbo > 0 ? `
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--gray2)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
            <span style="font-size:10px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-family:var(--mono)">${isHS ? 'Avancement fibres' : 'Avancement PBO'}</span>
            <span style="font-size:11px;font-weight:700;color:var(--blue);font-family:var(--mono)">${isHS ? `${auditesHS}/${totalFibres}` : `${auditesPbo}/${totalPbo}`} (${pct}%)</span>
          </div>
          <div style="height:6px;background:var(--gray2);border-radius:3px;overflow:hidden">
            <div style="height:100%;background:linear-gradient(90deg,var(--blue),#1565C0);width:${pct}%;transition:width .3s"></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px;font-size:10px;font-family:var(--mono)">
            <span style="color:var(--text4)">Fibres: <strong style="color:var(--text)">${totalFibres}</strong></span>
            <span style="color:var(--green)">✓ ${conformes} conformes</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
            ${(m.pbo_data?.length > 0 && m.pbo_data.some(p => p.audite || p.fibres?.some(f => f.conformite !== 'Non verifie'))) ? `<button onclick="openRapport('${m.id}')" style="font-size:11px;padding:6px 12px;background:#fff;border:1px solid var(--blue);color:var(--blue);border-radius:6px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">📊 Rapport PBO</button>` : ''}
            ${(m.pm_data || (m.type_audit==='HS' && m.pbo_data?.length>0)) ? `<button onclick="openRapportPM('${m.id}')" style="font-size:11px;padding:6px 12px;background:linear-gradient(135deg,#003087,#1565C0);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">📄 Rapport ${m.type_audit==='HS'?'HS':'PM'}</button>` : ''}
            ${m.pbo_data?.length > 0 ? `<button onclick="exportMissionCSV('${m.id}')" style="font-size:11px;padding:6px 12px;background:var(--blue);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">⬇ CSV</button>` : ''}
          </div>
        </div>` : `<div style="font-size:10px;color:var(--text4);font-style:italic;margin-top:6px">En attente de chargement de données...</div>${m.pm_data ? `<div style="display:flex;gap:6px;margin-top:10px"><button onclick="openRapportPM('${m.id}')" style="font-size:11px;padding:6px 12px;background:linear-gradient(135deg,#003087,#1565C0);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">📄 Rapport PM</button></div>` : ''}`}
      </div>`;
    }).join('');
  }
}

// ══════════════════════════════════════════════
// ADMIN — COMPTES
// ══════════════════════════════════════════════
function showCreateAccount() { document.getElementById('create-account-form').style.display = 'block'; }
function hideCreateAccount() { document.getElementById('create-account-form').style.display = 'none'; }

async function createAccount() {
  const prenom = document.getElementById('ca-prenom').value.trim();
  const nom = document.getElementById('ca-nom').value.trim();
  const email = document.getElementById('ca-email').value.trim();
  const password = document.getElementById('ca-password').value;
  const role = document.getElementById('ca-role').value;
  const zone = document.getElementById('ca-zone').value.trim();
  const msgEl = document.getElementById('create-account-msg');
  if (!prenom || !nom || !email || !password) {
    msgEl.innerHTML = '<div class="alert alert-error">Tous les champs obligatoires doivent être remplis.</div>';
    return;
  }
  msgEl.innerHTML = '<div class="alert alert-info"><span class="loading-spinner"></span>Création en cours...</div>';
  try {
    // Sauvegarder la session admin actuelle
    const { data: { session: adminSession } } = await sb.auth.getSession();
    
    // Créer l'utilisateur (le trigger SQL créera automatiquement le profil)
    const { data: authData, error: authErr } = await sb.auth.signUp({
      email, password,
      options: { 
        data: { nom, prenom, role },
        emailRedirectTo: undefined  // Don't redirect after email
      }
    });
    
    // Restaurer la session admin immédiatement
    if (adminSession) {
      await sb.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token
      });
    }
    
    if (authErr) {
      // Si rate limit, on dit à l'admin de créer le compte manuellement
      if (authErr.message.includes('rate limit')) {
        throw new Error('Limite Supabase atteinte. Créez le compte manuellement dans Supabase Auth puis ajoutez le profil.');
      }
      throw authErr;
    }
    if (!authData.user) throw new Error('Utilisateur non créé.');
    
    // Mettre à jour le profil créé par le trigger avec la zone
    if (zone) {
      await sb.from('profiles').update({ zone }).eq('id', authData.user.id);
    }
    msgEl.innerHTML = '<div class="alert alert-success">✅ Compte créé — l\'utilisateur peut se connecter avec ces identifiants.</div>';
    ['ca-prenom','ca-nom','ca-email','ca-password','ca-zone'].forEach(id => document.getElementById(id).value = '');
    await loadAccounts();
  } catch (err) {
    msgEl.innerHTML = '<div class="alert alert-error">Erreur : ' + err.message + '</div>';
  }
}

function renderAccounts() {
  const filter = document.getElementById('filter-role')?.value || '';
  const filtered = filter ? allUsers.filter(u => u.role === filter) : allUsers;
  document.getElementById('accounts-count').textContent = '(' + filtered.length + ')';
  if (!filtered.length) {
    document.getElementById('accounts-list').innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">Aucun utilisateur</div></div>';
    return;
  }
  document.getElementById('accounts-list').innerHTML = filtered.map(u => {
    const initials = (u.prenom[0]||'') + (u.nom[0]||'');
    const avatarCls = u.role === 'admin' ? 'avatar-admin' : u.role === 'be' ? 'avatar-be' : 'avatar-tech';
    const badgeCls = u.role === 'admin' ? 'badge-admin' : u.role === 'be' ? 'badge-be' : 'badge-tech';
    return `<div class="account-row">
      <div class="account-avatar ${avatarCls}">${initials.toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px">
          <span class="account-name">${u.prenom} ${u.nom}</span>
          <span class="role-badge ${badgeCls}">${u.role}</span>
          <span class="role-badge ${u.actif?'badge-actif':'badge-inactif'}">${u.actif?'Actif':'Inactif'}</span>
        </div>
        <div class="account-email">${u.email}</div>
      </div>
      ${u.zone ? `<span class="account-zone">📍 ${u.zone}</span>` : ''}
      ${u.id !== currentUser.id ? `
        <div style="display:flex;gap:5px">
          <button class="btn-mc primary" onclick="editUser('${u.id}')">✎ Modifier</button>
          <button class="btn-mc" onclick="toggleUserActif('${u.id}',${!u.actif})">${u.actif?'Désactiver':'Activer'}</button>
        </div>` : '<span style="font-size:10px;color:var(--text4);font-family:var(--mono)">Vous</span>'}
    </div>`;
  }).join('');
}

async function toggleUserActif(uid, actif) {
  await sb.from('profiles').update({ actif }).eq('id', uid);
  await loadAccounts();
}

function editUser(uid) {
  const user = allUsers.find(u => u.id === uid);
  if (!user) return;
  // Build modal
  const modalHtml = `<div id="edit-user-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)closeEditUser()">
    <div style="background:#fff;border-radius:12px;max-width:480px;width:100%;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3)">
      <div style="background:var(--blue);padding:18px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--red)">
        <div>
          <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:2px">Modifier l'utilisateur</div>
          <div style="font-size:16px;font-weight:800;color:#fff">${user.prenom} ${user.nom}</div>
        </div>
        <button onclick="closeEditUser()" style="width:30px;height:30px;border-radius:6px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:14px;cursor:pointer">✕</button>
      </div>
      <div style="padding:20px 24px">
        <div id="edit-user-msg"></div>
        <div class="form-row">
          <div><label class="form-label">Prénom</label><input class="form-input" id="eu-prenom" value="${esc(user.prenom||'')}"></div>
          <div><label class="form-label">Nom</label><input class="form-input" id="eu-nom" value="${esc(user.nom||'')}"></div>
        </div>
        <label class="form-label">Email</label>
        <input class="form-input" id="eu-email" value="${esc(user.email||'')}" disabled style="opacity:.6;cursor:not-allowed">
        <div class="form-row">
          <div>
            <label class="form-label">Rôle</label>
            <select class="form-select" id="eu-role">
              <option value="technicien"${user.role==='technicien'?' selected':''}>Technicien</option>
              <option value="be"${user.role==='be'?' selected':''}>Bureau d'études</option>
              <option value="admin"${user.role==='admin'?' selected':''}>Administrateur</option>
            </select>
          </div>
          <div><label class="form-label">Zone</label><input class="form-input" id="eu-zone" value="${esc(user.zone||'')}" placeholder="ex: Bordeaux"></div>
        </div>
        <label class="form-label">Statut</label>
        <select class="form-select" id="eu-actif">
          <option value="true"${user.actif?' selected':''}>Actif</option>
          <option value="false"${!user.actif?' selected':''}>Inactif</option>
        </select>
        <div style="margin-top:8px;padding:10px 14px;background:var(--gray);border-radius:8px;font-size:11px;color:var(--text3);font-family:var(--mono)">
          💡 Pour réinitialiser le mot de passe, utilisez Supabase &gt; Authentication
        </div>
        <div style="display:flex;gap:8px;margin-top:18px">
          <button class="btn btn-primary" style="flex:1" onclick="saveUserEdit('${uid}')">💾 Enregistrer</button>
          <button class="btn btn-ghost" onclick="closeEditUser()">Annuler</button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeEditUser() {
  document.getElementById('edit-user-overlay')?.remove();
}

async function saveUserEdit(uid) {
  const updates = {
    prenom: document.getElementById('eu-prenom').value.trim(),
    nom: document.getElementById('eu-nom').value.trim(),
    role: document.getElementById('eu-role').value,
    zone: document.getElementById('eu-zone').value.trim() || null,
    actif: document.getElementById('eu-actif').value === 'true'
  };
  const msgEl = document.getElementById('edit-user-msg');
  msgEl.innerHTML = '<div class="alert alert-info"><span class="loading-spinner"></span>Enregistrement...</div>';
  const { error } = await sb.from('profiles').update(updates).eq('id', uid);
  if (error) {
    msgEl.innerHTML = '<div class="alert alert-error">Erreur : ' + error.message + '</div>';
    return;
  }
  msgEl.innerHTML = '<div class="alert alert-success">✅ Modifications enregistrées</div>';
  await loadAccounts();
  setTimeout(closeEditUser, 800);
}

// ══════════════════════════════════════════════
// BE — MISSIONS
// ══════════════════════════════════════════════
function scCard(label, val, color) {
  return `<div class="sc"><div class="sc-l">${label}</div><div class="sc-v" style="color:${color||'var(--text)'}">${val}</div></div>`;
}

function renderBEStats() {
  const total = missions.length;
  const attente = missions.filter(m=>m.statut==='attente').length;
  const encours = missions.filter(m=>m.statut==='en-cours').length;
  const termine = missions.filter(m=>m.statut==='termine').length;
  const statsEl = document.getElementById('be-stats');
  if (statsEl) statsEl.innerHTML = scCard('Total',total,'var(--blue)') + scCard('Attente',attente,'#B45309') + scCard('En cours',encours,'var(--blue)') + scCard('Terminées',termine,'var(--green)');
  // Also update admin stats if on admin page
  const adminStatsEl = document.getElementById('admin-stats');
  if (adminStatsEl) adminStatsEl.innerHTML = scCard('Missions',total,'var(--blue)') + scCard('En attente',attente,'#B45309') + scCard('En cours',encours,'var(--blue)') + scCard('Terminées',termine,'var(--green)') + scCard('Utilisateurs',allUsers.length,'#7C3AED');
  renderActivityFeed('be-activity');
}

let beMissionPage = 1;
function setBEPage(p) {
  beMissionPage = p;
  renderBEMissions();
}

function renderBEMissions() {
  const listEl = document.getElementById('be-missions-list');
  if (!listEl) return;
  const s = (document.getElementById('be-search')?.value||'').toLowerCase();
  const f = document.getElementById('be-filter')?.value||'';
  const filtered = missions.filter(m =>
    (!s || m.ref_pm.toLowerCase().includes(s) || (m.tech?.nom||'').toLowerCase().includes(s)) &&
    (!f || m.statut === f)
  );
  if (!filtered.length) {
    listEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">Aucune mission</div><div class="empty-sub">Créez votre première mission ci-contre</div></div>';
    return;
  }
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (beMissionPage > totalPages) beMissionPage = totalPages;
  if (beMissionPage < 1) beMissionPage = 1;
  const startIdx = (beMissionPage - 1) * PAGE_SIZE;
  const shown = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const pageInfo = `<div style="font-size:10px;color:var(--text4);text-align:center;margin-top:6px;font-family:var(--mono)">${filtered.length} mission${filtered.length>1?'s':''} au total</div>`;
  listEl.innerHTML = shown.map(m => missionRow(m)).join('') + renderPagination(beMissionPage, filtered.length, 'setBEPage') + pageInfo;
}

function missionRow(m) {
  const pc = m.priorite === 'haute' ? 'var(--red)' : m.priorite === 'moyenne' ? '#F59E0B' : 'var(--green)';
  const sc = m.statut === 'attente' ? 'attente' : m.statut === 'en-cours' ? 'en-cours' : 'termine';
  const sl = m.statut === 'attente' ? 'En attente' : m.statut === 'en-cours' ? 'En cours' : 'Terminé';
  const techName = m.tech ? m.tech.prenom + ' ' + m.tech.nom : 'Non assigné';
  const pboCount = m.pbo_data ? m.pbo_data.length : 0;
  const hasReport = pboCount > 0 && m.pbo_data?.some(p => p.audite || p.fibres?.some(f => f.conformite !== 'Non verifie'));
  return `<div class="mission-card">
    <div class="mc-hdr">
      <div style="width:10px;height:10px;border-radius:50%;background:${pc};flex-shrink:0"></div>
      <div class="mc-ref">${m.ref_pm}</div>
      <span class="mc-status ${sc}">${sl}</span>
    </div>
    <div class="mc-body">
      <div><span class="mc-field-l">Technicien</span><span class="mc-field-v">${techName}</span></div>
      <div><span class="mc-field-l">Zone</span><span class="mc-field-v">${m.zone||'—'}</span></div>
      <div><span class="mc-field-l">Type</span><span class="mc-field-v">${m.type_audit}</span></div>
      <div><span class="mc-field-l">Date</span><span class="mc-field-v">${m.date_souhaitee||'—'}</span></div>
      ${pboCount > 0 ? `<div><span class="mc-field-l">PBO chargés</span><span class="mc-field-v" style="color:var(--blue)">${pboCount} PBO</span></div>` : ''}
    </div>
    ${m.note ? `<div class="mc-note">📝 ${m.note}</div>` : ''}
    <div class="mc-footer">
      <span style="font-size:10px;color:var(--text4);font-family:var(--mono)">${new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
      <div class="mc-actions">
        ${m.statut !== 'attente' ? '' : `<button class="btn-mc" onclick="updateMissionStatus('${m.id}','en-cours')">▶ Démarrer</button>`}
        ${m.statut === 'en-cours' ? `<button class="btn-mc" onclick="updateMissionStatus('${m.id}','termine')">✓ Terminé</button>` : ''}
        ${hasReport ? `<button class="btn-mc rapport" onclick="openRapport('${m.id}')">📊 Rapport PBO</button>` : ''}
        ${(m.pm_data || (m.type_audit==='HS' && m.pbo_data?.length>0)) ? `<button class="btn-mc rapport" style="background:linear-gradient(135deg,#003087,#1565C0);color:#fff;border:none" onclick="openRapportPM('${m.id}')">📄 Rapport ${m.type_audit==='HS'?'HS':'PM'}</button>` : ''}
        ${(currentUser?.role==='admin' || currentUser?.role==='be' || m.statut === 'termine') && (m.pbo_data?.length>0) ? `<button class="btn-mc" style="background:var(--blue);color:#fff;border:none" onclick="exportMissionCSV('${m.id}')">⬇ CSV</button>` : ''}
        ${(currentUser?.role==='admin' || currentUser?.role==='be') && m.type_audit==='PBO0' && m.pm_data?.pbo0_arrets?.length > 0 ? `<button class="btn-mc" style="background:var(--blue);color:#fff;border:none" onclick="exportPBO0CSV('${m.id}')">⬇ CSV tournée</button>` : ''}
        ${(currentUser?.role === 'admin' || currentUser?.role === 'be') ? `<button class="btn-mc" style="background:var(--yellow-lt,#FEF3C7);color:#B45309;border:1px solid #FCD34D" onclick="openEditMission('${m.id}')">✎ Modifier</button>
        <button class="btn-mc danger" onclick="deleteMission('${m.id}')">✕</button>` : ''}
      </div>
    </div>
  </div>`;
}

function togglePBOUpload() {
  const type = document.getElementById('f-type').value;
  const fg = document.getElementById('fg-pbo-file');
  if (type === 'PBO' || type === 'Complet' || type === 'HS' || type === 'PBO0') {
    fg.style.display = 'block';
    const label = fg.querySelector('.form-label');
    const fi = document.getElementById('be-pbo-file');
    if (type === 'PBO0') {
      if (label) label.textContent = 'Fichier tournée PBO à 0 (CSV) *';
      // Switch onchange to PBO0 parser
      if (fi) fi.setAttribute('onchange','beParsePBO0(this.files[0])');
    } else {
      if (label) label.textContent = (type === 'HS') ? 'Fichier ROP (audit fibres HS) *' : 'Fichier zone arrière (ROP/SNIF) *';
      if (fi) fi.setAttribute('onchange','beParsePBO(this.files[0])');
    }
  } else {
    fg.style.display = 'none';
    resetPBOUpload();
  }
}

function resetPBOUpload() {
  bePBOParsed = null; bePBOFileName = '';
  const st = document.getElementById('be-pbo-state');
  if (st) st.innerHTML = '<div style="font-size:22px;margin-bottom:6px">📋</div><div style="font-size:12px;font-weight:700;color:var(--text3)">Déposer le fichier ROP / SNIF CSV</div><div style="font-size:10px;color:var(--text4);margin-top:3px;font-family:var(--mono)">Le technicien recevra directement les PBO à auditer</div>';
  const fi = document.getElementById('be-pbo-file');
  if (fi) fi.value = '';
}

function beDropPBO(e) { e.preventDefault(); document.getElementById('be-pbo-dropzone').classList.remove('drag'); const f = e.dataTransfer.files[0]; if(f) beParsePBO(f); }

function beParsePBO(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const txt = e.target.result;
    const lines = txt.split(/\r?\n/);
    const h0 = lines[0];
    const sep = (h0.split(';').length > h0.split(',').length) ? ';' : ',';
    const hdr = splitLine(h0, sep).map(h => h.toLowerCase());
    function ci(n) { return hdr.findIndex(h => h.includes(n.toLowerCase())); }
    const pbos = {};
    for (let i = 1; i < lines.length; i++) {
      const ln = lines[i].trim(); if (!ln) continue;
      const p = splitLine(ln, sep); if (p.length < 4) continue;
      function gv(n) { const idx=ci(n); return idx>=0?(p[idx]||'').trim():''; }
      const ref = gv('reference PBO'); if (!ref) continue;
      if (!pbos[ref]) pbos[ref] = { reference_pbo: ref, cable: gv('reference cable PBO'), couleur_tube: gv('couleur tube PBO'), audite: false, audite_date: '', fibres: [] };
      pbos[ref].fibres.push({ id: 'f'+Math.random().toString(36).slice(2), num: gv('numero fibre tube PBO'), cfpbo: gv('couleur fibre PBO'), ctpm: gv('couleur tube PM'), cfpm: gv('couleur fibre PM'), modpm: gv('reference module PM'), pospm: gv('position module PM'), client: gv('client actif'), pto: gv('reference PTO'), statut_pto: gv('statut PTO'), id_rop: gv('id ROP'), conformite: 'Non verifie', note: '' });
    }
    bePBOParsed = Object.values(pbos);
    bePBOFileName = file.name;
    const count = bePBOParsed.length;
    const fibres = bePBOParsed.reduce((s,p)=>s+p.fibres.length,0);
    document.getElementById('be-pbo-state').innerHTML =
      '<div style="font-size:22px;margin-bottom:6px">✅</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--green)">' + file.name + '</div>' +
      '<div style="font-size:10px;color:var(--text3);margin-top:4px;font-family:var(--mono)">' + count + ' PBO · ' + fibres + ' fibres chargées</div>' +
      '<div style="font-size:10px;color:var(--text4);margin-top:2px;font-family:var(--mono)">Cliquer pour changer le fichier</div>';
  };
  reader.readAsText(file, 'Windows-1252');
}

// ── PBO à 0 (tournée) ──
let bePBO0Parsed = null;
function beParsePBO0(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let txt = e.target.result;
    // Supprimer BOM UTF-8 éventuel
    if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
    const lines = txt.split(/\r?\n/);
    let h0 = lines[0] || '';
    // Détection séparateur sur header
    const sep = (h0.split(';').length > h0.split(',').length) ? ';' : ',';
    const hdr = splitLine(h0, sep).map(h => h.toLowerCase().trim().replace(/^\uFEFF/, ''));
    function ce(name) { return hdr.indexOf(name.toLowerCase()); }
    // Diagnostic: colonnes obligatoires
    const required = ['pbo_id','imm_id','adresse','code_postal','commune','ordre_pbo'];
    const missing = required.filter(c => ce(c) < 0);
    if (missing.length) {
      document.getElementById('be-pbo-state').innerHTML =
        '<div style="font-size:22px;margin-bottom:6px">⚠️</div>' +
        '<div style="font-size:12px;font-weight:700;color:#DC2626">Colonnes manquantes</div>' +
        '<div style="font-size:10px;color:var(--text3);margin-top:6px;font-family:var(--mono)">Absent : ' + missing.join(', ') + '</div>' +
        '<div style="font-size:10px;color:var(--text4);margin-top:4px;font-family:var(--mono)">Séparateur détecté : "' + sep + '" · ' + hdr.length + ' colonnes</div>' +
        '<div style="font-size:9px;color:var(--text4);margin-top:4px;font-family:var(--mono);word-break:break-all">Header lu : ' + hdr.join(' | ') + '</div>';
      bePBO0Parsed = null;
      return;
    }
    const arrets = {};
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i] || !lines[i].trim()) continue;
      const p = splitLine(lines[i], sep);
      if (p.length < hdr.length) continue; // ligne incomplète/cassée
      function gv(name) { const idx=ce(name); return idx>=0?(p[idx]||'').trim():''; }
      const pboId = gv('pbo_id'); if (!pboId) continue;
      const ordre = parseInt(gv('ordre_pbo')) || 0;
      if (!arrets[pboId]) {
        arrets[pboId] = {
          pbo_id: pboId,
          ordre: ordre,
          lat: parseFloat(gv('pbo_lat')) || 0,
          lng: parseFloat(gv('pbo_lng')) || 0,
          verdict: gv('pbo_verdict'),
          verdict_label: gv('pbo_verdict_label'),
          nb_logements: parseInt(gv('pbo_nb_logements_total')) || 0,
          cas_presents: gv('pbo_cas_presents'),
          action: gv('pbo_action'),
          google_maps: gv('pbo_google_maps'),
          streetview: gv('pbo_streetview'),
          adresses: [],
          terrain: { statut: null, lat_corr: null, lng_corr: null, note: '', date: null }
        };
      }
      arrets[pboId].adresses.push({
        ordre: parseInt(gv('ordre_adresse')) || 0,
        imm_id: gv('imm_id'),
        adresse: gv('adresse'),
        code_postal: gv('code_postal'),
        commune: gv('commune'),
        lat: parseFloat(gv('imm_lat')) || 0,
        lng: parseFloat(gv('imm_lng')) || 0,
        nb_logements: parseInt(gv('nb_logements_ipe')) || 0,
        type_immeuble: gv('type_immeuble'),
        code_adresse: gv('code_adresse'),
        cas: gv('adresse_cas'),
        google_maps: gv('imm_google_maps'),
        streetview: gv('imm_streetview')
      });
    }
    bePBO0Parsed = Object.values(arrets).sort((a,b)=>a.ordre-b.ordre);
    bePBOFileName = file.name;
    const count = bePBO0Parsed.length;
    const totalAdr = bePBO0Parsed.reduce((s,a)=>s+a.adresses.length,0);
    if (!count) {
      document.getElementById('be-pbo-state').innerHTML =
        '<div style="font-size:22px;margin-bottom:6px">⚠️</div>' +
        '<div style="font-size:12px;font-weight:700;color:#DC2626">Aucun PBO lu</div>' +
        '<div style="font-size:10px;color:var(--text3);margin-top:6px;font-family:var(--mono)">' + (lines.length-1) + ' lignes · sép "' + sep + '" · ' + hdr.length + ' colonnes</div>' +
        '<div style="font-size:10px;color:var(--text4);margin-top:4px;font-family:var(--mono)">Vérifiez le format du fichier</div>';
      bePBO0Parsed = null;
      return;
    }
    // Aperçu 1er PBO pour vérif visuelle
    const a0 = bePBO0Parsed[0];
    const ad0 = a0.adresses[0] || {};
    document.getElementById('be-pbo-state').innerHTML =
      '<div style="font-size:22px;margin-bottom:6px">🗺️</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--green)">' + file.name + '</div>' +
      '<div style="font-size:10px;color:var(--text3);margin-top:4px;font-family:var(--mono)">' + count + ' PBO · ' + totalAdr + ' adresses</div>' +
      '<div style="font-size:9px;color:var(--text4);margin-top:6px;font-family:var(--mono);text-align:left;background:#F4F6FA;padding:6px;border-radius:4px">Aperçu PBO 1 :<br>id=' + a0.pbo_id + '<br>adr=' + (ad0.adresse||'?') + '<br>cp=' + (ad0.code_postal||'?') + ' ' + (ad0.commune||'?') + '<br>imm_id=' + (ad0.imm_id||'?') + '</div>' +
      '<div style="font-size:10px;color:var(--text4);margin-top:4px;font-family:var(--mono)">Cliquer pour changer le fichier</div>';
  };
  reader.readAsText(file, 'UTF-8');
}

async function createMission() {
  const ref = document.getElementById('f-ref').value.trim();
  if (!ref) { document.getElementById('f-ref').focus(); return; }
  const type = document.getElementById('f-type').value;
  const msgEl = document.getElementById('create-mission-msg');
  if ((type === 'PBO' || type === 'Complet' || type === 'HS') && !bePBOParsed) {
    msgEl.innerHTML = '<div class="alert alert-error">Veuillez charger le fichier ROP/SNIF.</div>';
    return;
  }
  if (type === 'PBO0' && !bePBO0Parsed) {
    msgEl.innerHTML = '<div class="alert alert-error">Veuillez charger le fichier tournée PBO à 0.</div>';
    return;
  }
  msgEl.innerHTML = '<div class="alert alert-info"><span class="loading-spinner"></span>Création...</div>';
  const techId = document.getElementById('f-tech-select').value || null;
  if (!techId) {
    msgEl.innerHTML = '<div class="alert alert-error">Veuillez sélectionner un technicien.</div>';
    document.getElementById('f-tech-select').focus();
    return;
  }
  const { data: mission, error } = await sb.from('missions').insert({
    ref_pm: ref,
    zone: document.getElementById('f-zone').value.trim() || '—',
    type_audit: type,
    priorite: selectedPrio,
    note: document.getElementById('f-note').value.trim(),
    be_id: currentUser.id,
    tech_id: techId,
    date_souhaitee: document.getElementById('f-date').value || null,
    pm_data: (type === 'PBO0' && bePBO0Parsed) ? { pbo0_arrets: bePBO0Parsed } : null,
    pm_filename: (type === 'PBO0' && bePBO0Parsed) ? bePBOFileName : null
  }).select().single();
  if (error) { msgEl.innerHTML = '<div class="alert alert-error">Erreur : ' + error.message + '</div>'; return; }
  // Insert PBO data if present
  if (bePBOParsed && mission) {
    for (const pbo of bePBOParsed) {
      const { data: pboRow } = await sb.from('pbo_data').insert({ mission_id: mission.id, reference_pbo: pbo.reference_pbo, cable: pbo.cable, couleur_tube: pbo.couleur_tube }).select().single();
      if (pboRow && pbo.fibres.length) {
        await sb.from('fibres').insert(pbo.fibres.map(f => ({
          pbo_id: pboRow.id, mission_id: mission.id,
          num_fibre: f.num, couleur_fibre_pbo: f.cfpbo, couleur_tube_pm: f.ctpm, id_rop: f.id_rop,
          couleur_fibre_pm: f.cfpm, reference_module_pm: f.modpm, position_module_pm: f.pospm,
          client_actif: f.client, reference_pto: f.pto, statut_pto: f.statut_pto
        })));
      }
    }
  }
  msgEl.innerHTML = '<div class="alert alert-success">✅ Mission créée avec succès !</div>';
  ['f-ref','f-zone','f-note'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').selectedIndex = 0;
  document.getElementById('f-tech-select').selectedIndex = 0;
  document.getElementById('f-date').valueAsDate = new Date();
  resetPBOUpload(); togglePBOUpload(); setPrio('haute');
  bePBO0Parsed = null;
  setTimeout(() => { msgEl.innerHTML = ''; }, 3000);
  await loadMissions();
}

async function updateMissionStatus(id, statut) {
  const upd = { statut };
  if (statut === 'en-cours') upd.date_demarrage = new Date().toISOString();
  if (statut === 'termine') upd.date_fin = new Date().toISOString();
  await sb.from('missions').update(upd).eq('id', id);
  await loadMissions();
  if (currentUser.role !== 'be' && currentUser.role !== 'admin') await loadMyMissions();
}

function openEditMission(id) {
  const m = missions.find(x => x.id === id);
  if (!m) return;
  const techsOptions = techniciens.map(t => `<option value="${t.id}" ${t.id===m.tech_id?'selected':''}>${t.prenom||''} ${t.nom||''}</option>`).join('');
  const html = `<div id="edit-mission-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto" onclick="if(event.target===this)document.getElementById('edit-mission-overlay').remove()">
    <div style="background:#fff;border-radius:12px;max-width:560px;width:100%;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3);margin:20px 0">
      <div style="background:linear-gradient(135deg,#003087,#1565C0);color:#fff;padding:18px 24px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:.85">Modifier la mission</div>
          <div style="font-size:20px;font-weight:900;margin-top:2px">${m.ref_pm}</div>
        </div>
        <button onclick="document.getElementById('edit-mission-overlay').remove()" style="width:36px;height:36px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer;font-weight:bold">✕</button>
      </div>
      <div style="padding:20px 24px">
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Référence PM</label>
          <input id="edit-ref" class="form-input" value="${m.ref_pm}" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div>
            <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Zone / Ville</label>
            <input id="edit-zone" class="form-input" value="${m.zone||''}" />
          </div>
          <div>
            <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Date souhaitée</label>
            <input id="edit-date" type="date" class="form-input" value="${m.date_souhaitee||''}" />
          </div>
        </div>
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Technicien assigné *</label>
          <select id="edit-tech" class="form-select">
            <option value="">— Sélectionner un technicien —</option>
            ${techsOptions}
          </select>
        </div>
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Priorité</label>
          <select id="edit-prio" class="form-select">
            <option value="haute" ${m.priorite==='haute'?'selected':''}>Haute</option>
            <option value="moyenne" ${m.priorite==='moyenne'?'selected':''}>Moyenne</option>
            <option value="basse" ${m.priorite==='basse'?'selected':''}>Basse</option>
          </select>
        </div>
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:4px">Note / Instructions</label>
          <textarea id="edit-note" class="form-input" style="min-height:70px;resize:vertical;font-family:inherit">${m.note||''}</textarea>
        </div>
        <div id="edit-msg"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">
          <button onclick="document.getElementById('edit-mission-overlay').remove()" style="padding:10px 18px;background:#fff;border:1px solid var(--gray3);color:var(--text);border-radius:8px;cursor:pointer;font-weight:700;font-family:'Syne',sans-serif">Annuler</button>
          <button onclick="saveEditMission('${id}')" style="padding:10px 18px;background:var(--blue);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-family:'Syne',sans-serif">💾 Enregistrer</button>
        </div>
      </div>
    </div>
  </div>`;
  document.querySelectorAll('#edit-mission-overlay').forEach(el=>el.remove());
  document.body.insertAdjacentHTML('beforeend', html);
}

async function saveEditMission(id) {
  const techId = document.getElementById('edit-tech').value;
  const msgEl = document.getElementById('edit-msg');
  if (!techId) {
    msgEl.innerHTML = '<div class="alert alert-error">Le technicien est obligatoire.</div>';
    return;
  }
  const ref = document.getElementById('edit-ref').value.trim();
  if (!ref) {
    msgEl.innerHTML = '<div class="alert alert-error">La référence PM est obligatoire.</div>';
    return;
  }
  msgEl.innerHTML = '<div class="alert alert-info"><span class="loading-spinner"></span>Enregistrement...</div>';
  const upd = {
    ref_pm: ref,
    zone: document.getElementById('edit-zone').value.trim() || '—',
    date_souhaitee: document.getElementById('edit-date').value || null,
    tech_id: techId,
    priorite: document.getElementById('edit-prio').value,
    note: document.getElementById('edit-note').value.trim()
  };
  const { error } = await sb.from('missions').update(upd).eq('id', id);
  if (error) {
    msgEl.innerHTML = '<div class="alert alert-error">Erreur : ' + error.message + '</div>';
    return;
  }
  await loadMissions();
  document.getElementById('edit-mission-overlay').remove();
  if (currentUser.role === 'admin') loadAdminDashboard();
  else if (currentUser.role === 'be') { renderBEMissions(); renderBEStats(); }
}

async function deleteMission(id) {
  if (!confirm('Supprimer cette mission et toutes ses données ?')) return;
  await sb.from('missions').delete().eq('id', id);
  missions = missions.filter(m => m.id !== id);
  renderBEMissions(); renderBEStats();
}

function setPrio(p) {
  selectedPrio = p;
  ['haute','moyenne','basse'].forEach(x => {
    const b = document.getElementById('pb-'+x);
    if (b) b.className = 'prio-btn' + (x===p ? ' active-'+x : '');
  });
}

// ══════════════════════════════════════════════
// TECH — MISSIONS
// ══════════════════════════════════════════════
// ── Helper pagination réutilisable ──
const PAGE_SIZE = 8;
function renderPagination(currentPage, totalItems, onPageFnName) {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (totalPages <= 1) return '';
  const btn = (label, page, disabled) =>
    `<button ${disabled?'disabled':''} onclick="${onPageFnName}(${page})" style="padding:7px 14px;font-size:11px;font-weight:700;border:1px solid var(--gray3);border-radius:6px;cursor:${disabled?'not-allowed':'pointer'};background:#fff;color:${disabled?'var(--text4)':'var(--blue)'};opacity:${disabled?'.45':'1'}">${label}</button>`;
  return `<div style="display:flex;gap:10px;justify-content:center;align-items:center;margin-top:10px">
    ${btn('‹ Préc', currentPage-1, currentPage<=1)}
    <span style="font-size:11px;font-weight:700;color:var(--text3);font-family:var(--mono)">Page ${currentPage}/${totalPages}</span>
    ${btn('Suiv ›', currentPage+1, currentPage>=totalPages)}
  </div>`;
}

let techMissionFilter = 'en-cours'; // 'en-cours' | 'termine' | 'tous'
let techMissionPage = 1;

function setTechFilter(f) {
  techMissionFilter = f;
  techMissionPage = 1;
  renderTechMissions();
}
function setTechPage(p) {
  techMissionPage = p;
  renderTechMissions();
}

function renderTechMissions() {
  const pending = missions.filter(m => m.statut !== 'termine');
  const done = missions.filter(m => m.statut === 'termine');
  document.getElementById('tech-count').textContent = pending.length + ' active' + (pending.length!==1?'s':'');
  const list = document.getElementById('tech-missions-list');
  if (!missions.length) { list.innerHTML = '<div class="no-missions-msg">Aucune mission assignée</div>'; return; }
  // Filtrage
  let filtered;
  if (techMissionFilter === 'en-cours') filtered = pending;
  else if (techMissionFilter === 'termine') filtered = done;
  else filtered = [...pending, ...done];
  // Barre de filtres
  const fBtn = (key, label, count) => `<button onclick="setTechFilter('${key}')" style="flex:1;padding:7px 4px;font-size:11px;font-weight:700;border:none;border-radius:6px;cursor:pointer;background:${techMissionFilter===key?'var(--blue)':'var(--gray2)'};color:${techMissionFilter===key?'#fff':'var(--text3)'}">${label} (${count})</button>`;
  const filterBar = `<div style="display:flex;gap:6px;margin-bottom:10px">
    ${fBtn('en-cours','En cours',pending.length)}
    ${fBtn('termine','Terminé',done.length)}
    ${fBtn('tous','Tous',missions.length)}
  </div>`;
  if (!filtered.length) {
    list.innerHTML = filterBar + '<div class="no-missions-msg">Aucune mission dans ce filtre</div>';
    return;
  }
  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (techMissionPage > totalPages) techMissionPage = totalPages;
  if (techMissionPage < 1) techMissionPage = 1;
  const startIdx = (techMissionPage - 1) * PAGE_SIZE;
  const shown = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const itemsHtml = shown.map(m => {
    const pc = m.priorite==='haute'?'var(--red)':m.priorite==='moyenne'?'#F59E0B':'var(--green)';
    const cls = (m.id===selectedMissionId?'active-item':'') + (m.statut==='termine'?' done-item':'');
    return `<div class="mission-item ${cls}" onclick="selectMission('${m.id}')">
      <div class="mi-status-dot" style="background:${pc}"></div>
      <div style="flex:1;min-width:0">
        <div class="mi-ref">${m.ref_pm}</div>
        <div class="mi-meta">${m.type_audit} · ${m.zone}</div>
      </div>
      <span class="mc-status ${m.statut}" style="font-size:9px">${m.statut==='attente'?'Attente':m.statut==='en-cours'?'En cours':'Terminé'}</span>
    </div>`;
  }).join('');
  const pageInfo = `<div style="font-size:10px;color:var(--text4);text-align:center;margin-top:6px;font-family:var(--mono)">${filtered.length} mission${filtered.length>1?'s':''}</div>`;
  list.innerHTML = filterBar + itemsHtml + renderPagination(techMissionPage, filtered.length, 'setTechPage') + pageInfo;
}

async function selectMission(id) {
  // Reset audit state when changing mission
  if (selectedMissionId !== id) {
    pboData = [];
    pmData = null;
    pmPhotos = [];
    // Reset HS mode state when switching missions
    isHSMode = false;
    hsFibres = {};
    hsSelected.clear();
    batchModeOn = false;
    batchBarExpanded = false;
    document.body.classList.remove('hs-mode');
    // Remove HS batch bar and stats bar if exist
    const oldBar = document.getElementById('hs-batch-bar');
    if (oldBar) oldBar.remove();
    const oldStatsBar = document.getElementById('hs-stats-bar');
    if (oldStatsBar) oldStatsBar.remove();
    // Hide global CSV button
    const btnGlobal = document.getElementById('btn-csv-all-hs');
    if (btnGlobal) btnGlobal.style.display = 'none';
    // Show commandes module by default
    const cmdMod = document.getElementById('cmd-module');
    if (cmdMod) cmdMod.style.display = '';
    Object.keys(pboPhotos).forEach(k => delete pboPhotos[k]);
    // Hide PBO and PM result panels
    const pboRes = document.getElementById('pbo-result');
    if (pboRes) pboRes.style.display = 'none';
    const pboNoMis = document.getElementById('pbo-no-mission');
    if (pboNoMis) pboNoMis.style.display = 'block';
    const pmRes = document.getElementById('pm-result');
    if (pmRes) pmRes.style.display = 'none';
    const pmEmpty = document.getElementById('pm-empty');
    if (pmEmpty) pmEmpty.style.display = 'block';
    // Clear PBO list
    const pboList = document.getElementById('pbo-list');
    if (pboList) pboList.innerHTML = '';
    // Reset file inputs
    const pmFile = document.getElementById('pm-file');
    if (pmFile) pmFile.value = '';
  }
  // Auto-load PBO data and PM data if mission is en-cours
  const mission = missions.find(x => x.id === id);
  if (mission && mission.statut === 'en-cours') {
    selectedMissionId = id;
    currentPBO0Mission = mission;
    await startAudit(id);
    return;
  }
  selectedMissionId = id;
  renderTechMissions();
  const m = missions.find(x => x.id === id);
  currentPBO0Mission = m;
  renderMissionDetail(m);
}

function renderMissionDetail(m) {
  const el = document.getElementById('tech-detail');
  if (!m) { el.innerHTML = '<div class="no-sel-msg"><div style="font-size:32px;margin-bottom:10px">👆</div><div style="font-size:13px;font-weight:700;color:var(--text3)">Sélectionnez une mission</div></div>'; return; }
  const isDone = m.statut === 'termine';
  // ── Vue PBO0 (tournée) ──
  if (m.type_audit === 'PBO0') { renderPBO0Detail(m); return; }
  el.innerHTML = `<div class="md-hdr">
      <div class="md-label">Mission · ${m.priorite?.toUpperCase()}</div>
      <div class="md-ref">${m.ref_pm}</div>
      <div class="md-sub">📍 ${m.zone} · ${m.type_audit}</div>
    </div>
    <div class="md-body">
      <div class="md-grid">
        <div class="md-field"><div class="md-field-l">Statut</div><div class="md-field-v" style="color:${m.statut==='termine'?'var(--green)':m.statut==='en-cours'?'var(--blue)':'#B45309'}">${m.statut==='attente'?'En attente':m.statut==='en-cours'?'En cours':'Terminé'}</div></div>
        <div class="md-field"><div class="md-field-l">Date souhaitée</div><div class="md-field-v">${m.date_souhaitee||'—'}</div></div>
        <div class="md-field"><div class="md-field-l">PBO chargés</div><div class="md-field-v">${m.pbo_data?.length||0} PBO</div></div>
        <div class="md-field"><div class="md-field-l">Démarrage</div><div class="md-field-v">${m.date_demarrage?new Date(m.date_demarrage).toLocaleDateString('fr-FR'):'—'}</div></div>
      </div>
      ${m.note ? `<div class="md-note"><div class="md-note-l">Instructions BE</div>${m.note}</div>` : ''}
      <div class="md-actions">
        ${m.statut==='attente' ? `<button class="btn-start" onclick="startAudit('${m.id}')">▶ Démarrer l'audit</button>` : ''}
        ${m.statut==='en-cours' ? `<div style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--blue-lt);border:1px solid rgba(0,48,135,.2);border-radius:8px;font-family:'Syne',sans-serif;font-weight:700;color:var(--blue);font-size:13px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--blue);animation:pulse 2s infinite"></span>En cours</div>` : ''}
        ${m.statut==='en-cours' ? `<button class="btn-done" onclick="updateMissionStatus('${m.id}','termine');renderMissionDetail(missions.find(x=>x.id==='${m.id}'));renderTechMissions()">✓ Marquer terminé</button>` : ''}
        ${isDone ? `<button class="btn-mc" style="font-size:13px;padding:10px 18px;font-weight:700;background:#F59E0B;color:#fff;border:none" onclick="reopenMission('${m.id}')">↩ Reprendre la mission</button>` : ''}
        ${(m.pbo_data?.length > 0 && m.pbo_data.some(p => p.audite || p.fibres?.some(f => f.conformite !== 'Non verifie'))) ? `<button class="btn-mc rapport" style="font-size:13px;padding:10px 18px;font-weight:700" onclick="openRapport('${m.id}')">📊 Rapport PBO</button>
        <button class="btn-mc" style="font-size:13px;padding:10px 18px;font-weight:700;background:var(--red);color:#fff;border:none" onclick="exportRapportPDF('${m.id}')">📄 PDF PBO</button>
        ${isDone ? `<button class="btn-mc" style="font-size:13px;padding:10px 18px;font-weight:700;background:var(--blue);color:#fff;border:none" onclick="exportMissionCSV('${m.id}')">⬇ CSV</button>` : ''}` : ''}
        ${(m.pm_data || (m.type_audit==='HS' && m.pbo_data?.length>0)) ? `<button class="btn-mc rapport" style="font-size:13px;padding:10px 18px;font-weight:700;background:linear-gradient(135deg,#003087,#1565C0);color:#fff;border:none" onclick="openRapportPM('${m.id}')">📄 Rapport ${m.type_audit==='HS'?'HS':'PM'}</button>` : ''}
      </div>
      ${isDone ? '<div style="font-size:11px;color:var(--green);font-weight:700;padding:8px 12px;background:var(--green-lt);border-radius:6px;text-align:center;margin-top:10px">✅ Mission terminée — Vous pouvez la rouvrir si besoin</div>' : ''}
    </div>`;
}

async function reopenMission(id){
  if(!confirm('Rouvrir cette mission ? Elle repassera en statut "En cours".'))return;
  await sb.from('missions').update({statut:'en-cours',date_fin:null}).eq('id',id);
  if(currentUser.role==='technicien'){await loadMyMissions();}else{await loadMissions();}
  const m=missions.find(x=>x.id===id);
  renderMissionDetail(m);
  if(currentUser.role==='technicien')renderTechMissions();
}

// ══════════════════════════════════════════════
// PBO0 — Tournée PBO à 0 (vue technicien)
// ══════════════════════════════════════════════
let pbo0Map = null;
let pbo0MapMarkers = [];
let pbo0View = 'list'; // 'list' ou 'map'

function getPBO0Arrets(m) {
  return (m.pm_data && m.pm_data.pbo0_arrets) ? m.pm_data.pbo0_arrets : [];
}

function pbo0VerdictMeta(v) {
  const map = {
    'deploye':    { label:'Déployé',           color:'#16A34A', bg:'#DCFCE7', emoji:'✅' },
    'non_deploye':{ label:'Non déployé',       color:'#B45309', bg:'#FEF3C7', emoji:'⚠️' },
    'coord_modif':{ label:'Coord. à modifier', color:'#003087', bg:'#DBEAFE', emoji:'📍' },
    'introuvable':{ label:'Introuvable',       color:'#DC2626', bg:'#FEE2E2', emoji:'❌' }
  };
  return map[v] || null;
}

function renderPBO0Detail(m) {
  const el = document.getElementById('tech-detail');
  console.log('[PBO0] mission:', m.id, 'pm_data type:', typeof m.pm_data, 'arrets:', m.pm_data?.pbo0_arrets?.length, 'sample:', m.pm_data?.pbo0_arrets?.[0]);
  const isDone = m.statut === 'termine';
  const arrets = getPBO0Arrets(m);
  const total = arrets.length;
  const traites = arrets.filter(a => a.terrain && a.terrain.statut).length;
  const pct = total ? Math.round((traites/total)*100) : 0;
  const isReadOnly = isDone || m.statut === 'attente';
  el.innerHTML = `
    <div class="md-hdr">
      <div class="md-label">Mission · ${(m.priorite||'').toUpperCase()} · PBO à 0</div>
      <div class="md-ref">${m.ref_pm}</div>
      <div class="md-sub">📍 ${m.zone} · ${total} PBO à visiter</div>
    </div>
    <div class="md-body">
      <div style="background:#fff;border:1px solid var(--gray3);border-radius:8px;padding:12px 14px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:12px;font-weight:700;color:var(--text3);font-family:var(--mono)">${traites} / ${total} traités · ${pct}%</div>
          <div style="font-size:11px;color:var(--text4);font-family:var(--mono)">${m.statut==='en-cours'?'EN COURS':m.statut==='attente'?'EN ATTENTE':'TERMINÉ'}</div>
        </div>
        <div style="height:8px;background:var(--gray2);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#003087,#1565C0);transition:width .3s"></div>
        </div>
      </div>
      ${m.statut==='attente' ? `<button class="btn-start" onclick="startAudit('${m.id}')">▶ Démarrer la tournée</button>` : ''}
      ${m.statut==='en-cours' ? `
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button class="btn-mc ${pbo0View==='list'?'rapport':''}" style="flex:1;font-size:12px;padding:9px;font-weight:700${pbo0View==='list'?';background:var(--blue);color:#fff;border:none':''}" onclick="setPBO0View('list','${m.id}')">📋 Liste</button>
          <button class="btn-mc ${pbo0View==='map'?'rapport':''}" style="flex:1;font-size:12px;padding:9px;font-weight:700${pbo0View==='map'?';background:var(--blue);color:#fff;border:none':''}" onclick="setPBO0View('map','${m.id}')">🗺️ Carte itinéraire</button>
        </div>
      ` : ''}
      ${m.statut !== 'attente' ? `<div id="pbo0-content">${pbo0View==='map' ? renderPBO0Map() : renderPBO0List(arrets, isReadOnly)}</div>` : ''}
      <div class="md-actions" style="margin-top:14px">
        ${m.statut==='en-cours' ? `<button class="btn-done" onclick="finishPBO0Mission('${m.id}')">✓ Terminer la tournée</button>` : ''}
        ${isDone ? `<button class="btn-mc" style="font-size:13px;padding:10px 18px;font-weight:700;background:#F59E0B;color:#fff;border:none" onclick="reopenMission('${m.id}')">↩ Reprendre la tournée</button>` : ''}
        ${(currentUser.role==='admin'||currentUser.role==='be') && traites>0 ? `<button class="btn-mc" style="font-size:13px;padding:10px 18px;font-weight:700;background:var(--blue);color:#fff;border:none" onclick="exportPBO0CSV('${m.id}')">⬇ CSV résultats</button>` : ''}
      </div>
    </div>
  `;
  if (pbo0View === 'map' && m.statut === 'en-cours') setTimeout(()=>initPBO0Map(arrets), 100);
}

function renderPBO0List(arrets, readOnly) {
  if (!arrets.length) return '<div style="text-align:center;padding:30px;color:var(--text4);font-family:var(--mono);font-size:12px">Aucun PBO dans la tournée</div>';
  // Prochain non traité
  const nextIdx = arrets.findIndex(a => !a.terrain || !a.terrain.statut);
  return arrets.map((a, idx) => renderPBO0Card(a, idx, idx===nextIdx, readOnly)).join('');
}

function renderPBO0Card(a, idx, isNext, readOnly) {
  const v = a.terrain && a.terrain.statut ? pbo0VerdictMeta(a.terrain.statut) : null;
  // Adresse PBO = adresse de référence (1ère adresse ou ordre_adresse=1)
  const adrPBO = a.adresses.find(x => x.ordre === 1) || a.adresses[0] || {};
  const adrPBOTxt = adrPBO.adresse ? `${adrPBO.adresse}, ${adrPBO.code_postal || ''} ${adrPBO.commune || ''}`.trim() : '—';
  const adrsHtml = a.adresses.map((ad, i) => `
    <div style="background:#F4F6FA;border-left:3px solid var(--blue);padding:8px 10px;margin-top:${i===0?'10':'6'}px;border-radius:4px">
      <div style="display:flex;justify-content:space-between;align-items:start;gap:6px;margin-bottom:4px">
        <div style="font-size:12px;font-weight:700;color:var(--text);line-height:1.3;flex:1">${ad.adresse || '—'}</div>
        ${ad.imm_id ? `<span style="font-size:9px;font-family:var(--mono);color:var(--text4);background:#fff;padding:2px 5px;border-radius:3px;border:1px solid var(--gray3);white-space:nowrap">${ad.imm_id}</span>` : ''}
      </div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:5px;font-family:var(--mono)">
        <b>${ad.code_postal || ''}</b> ${ad.commune || ''}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <span style="font-size:10px;background:#fff;border:1px solid var(--gray3);padding:2px 7px;border-radius:10px;color:var(--text3);font-weight:700">🏠 ${ad.nb_logements} log.</span>
        <span style="font-size:10px;background:#fff;border:1px solid var(--gray3);padding:2px 7px;border-radius:10px;color:var(--text3)">${ad.type_immeuble || '—'}</span>
        ${ad.cas ? `<span style="font-size:10px;background:#FEF3C7;color:#B45309;padding:2px 7px;border-radius:10px;font-weight:700">${ad.cas}</span>` : ''}
      </div>
    </div>
  `).join('');
  const borderColor = v ? v.color : (isNext ? 'var(--blue)' : 'var(--gray3)');
  const borderWidth = isNext ? '2px' : '1px';
  return `
    <div id="pbo0-card-${idx}" style="background:#fff;border:${borderWidth} solid ${borderColor};border-radius:8px;padding:12px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
        <div style="font-size:11px;font-weight:700;color:var(--blue);font-family:var(--mono);letter-spacing:.5px">📍 Arrêt N°${a.ordre || (idx+1)}${isNext?' · PROCHAIN':''}</div>
        ${v ? `<span style="background:${v.bg};color:${v.color};padding:3px 8px;border-radius:4px;font-size:10px;font-weight:700">${v.emoji} ${v.label}</span>` : ''}
      </div>
      <div style="font-family:var(--mono);font-size:11px;color:var(--text3);margin-bottom:6px">${a.pbo_id}</div>
      <div style="background:#003087;color:#fff;padding:8px 10px;border-radius:6px;margin-bottom:6px">
        <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;opacity:.85;margin-bottom:2px">Adresse PBO</div>
        <div style="font-size:12px;font-weight:700;line-height:1.3">${adrPBOTxt}</div>
        <div style="font-size:10px;opacity:.85;font-family:var(--mono);margin-top:3px">GPS: ${a.lat.toFixed(6)}, ${a.lng.toFixed(6)}</div>
      </div>
      <div style="font-size:11px;color:var(--text4);margin-bottom:4px">${a.verdict_label || ''} · Total ${a.nb_logements} logements · ${a.adresses.length} immeuble${a.adresses.length>1?'s':''}</div>
      ${adrsHtml}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px">
        <a href="${a.google_maps}" target="_blank" style="background:var(--blue);color:#fff;text-align:center;padding:8px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">🧭 Y aller</a>
        <a href="${a.streetview}" target="_blank" style="background:var(--gray2);color:var(--text);text-align:center;padding:8px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">👁 Street view</a>
      </div>
      ${readOnly ? '' : `
        <div style="font-size:10px;color:var(--text3);margin:10px 0 6px;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Verdict terrain</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <button onclick="setPBO0Verdict(${idx},'deploye')" style="padding:9px;font-size:11px;font-weight:700;border:1px solid #16A34A;background:${a.terrain&&a.terrain.statut==='deploye'?'#16A34A':'#fff'};color:${a.terrain&&a.terrain.statut==='deploye'?'#fff':'#16A34A'};border-radius:6px;cursor:pointer">✅ Déployé</button>
          <button onclick="setPBO0Verdict(${idx},'non_deploye')" style="padding:9px;font-size:11px;font-weight:700;border:1px solid #B45309;background:${a.terrain&&a.terrain.statut==='non_deploye'?'#B45309':'#fff'};color:${a.terrain&&a.terrain.statut==='non_deploye'?'#fff':'#B45309'};border-radius:6px;cursor:pointer">⚠️ Non déployé</button>
          <button onclick="setPBO0Verdict(${idx},'coord_modif')" style="padding:9px;font-size:11px;font-weight:700;border:1px solid #003087;background:${a.terrain&&a.terrain.statut==='coord_modif'?'#003087':'#fff'};color:${a.terrain&&a.terrain.statut==='coord_modif'?'#fff':'#003087'};border-radius:6px;cursor:pointer">📍 Coord. à modif</button>
          <button onclick="setPBO0Verdict(${idx},'introuvable')" style="padding:9px;font-size:11px;font-weight:700;border:1px solid #DC2626;background:${a.terrain&&a.terrain.statut==='introuvable'?'#DC2626':'#fff'};color:${a.terrain&&a.terrain.statut==='introuvable'?'#fff':'#DC2626'};border-radius:6px;cursor:pointer">❌ Introuvable</button>
        </div>
        ${a.terrain && a.terrain.statut==='coord_modif' ? `
          <div style="margin-top:8px;padding:10px;background:#DBEAFE;border-radius:6px">
            <div style="font-size:10px;color:#003087;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">📍 Nouvelle position via photo</div>
            <input type="file" id="pbo0-photo-input-${idx}" accept="image/*" capture="environment" onchange="capturePBO0Photo(${idx}, this.files[0])" style="display:none">
            <button onclick="document.getElementById('pbo0-photo-input-${idx}').click()" style="width:100%;padding:10px;font-size:11px;font-weight:700;background:#003087;color:#fff;border:none;border-radius:6px;cursor:pointer">📸 Prendre la photo (capture la position GPS)</button>
            <div id="pbo0-photo-status-${idx}" style="font-size:10px;color:var(--blue);margin-top:6px;font-family:var(--mono)">${
              a.terrain.lat_corr
                ? '✅ Position: ' + a.terrain.lat_corr.toFixed(6) + ', ' + a.terrain.lng_corr.toFixed(6) + (a.terrain.photo_url ? ' · 📷 photo OK' : '')
                : 'En attente de la photo...'
            }</div>
            ${a.terrain.photo_url ? `<img src="${a.terrain.photo_url}" style="width:100%;margin-top:6px;border-radius:6px;max-height:160px;object-fit:cover">` : ''}
          </div>
        ` : ''}
        <textarea id="pbo0-note-${idx}" placeholder="Note terrain (optionnel)..." onblur="savePBO0Note(${idx}, this.value)" style="width:100%;margin-top:8px;font-size:11px;min-height:50px;padding:8px;border:1px solid var(--gray3);border-radius:6px;font-family:var(--mono);resize:vertical">${a.terrain && a.terrain.note ? a.terrain.note : ''}</textarea>
      `}
    </div>
  `;
}

function renderPBO0Map() {
  return `
    <div id="pbo0-leaflet-map" style="height:420px;border-radius:8px;border:1px solid var(--gray3);margin-bottom:8px"></div>
    <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px;padding:8px 10px;background:#fff;border:1px solid var(--gray3);border-radius:6px">
      <div id="pbo0-tech-pos" style="font-size:10px;color:var(--text4);font-family:var(--mono)">📡 Position GPS : en attente...</div>
      <button id="pbo0-toggle-gps" onclick="togglePBO0GPS()" style="font-size:11px;padding:5px 10px;background:var(--blue);color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:700">🛰 Activer GPS</button>
    </div>
    <div style="font-size:10px;color:var(--text4);text-align:center;font-family:var(--mono)">Trait bleu = itinéraire 1→${(currentPBO0Mission && currentPBO0Mission.pm_data && currentPBO0Mission.pm_data.pbo0_arrets) ? currentPBO0Mission.pm_data.pbo0_arrets.length : 'N'} · Pastille bleue pulsante = vous</div>
  `;
}

let pbo0TechMarker = null;
let pbo0TechCircle = null;
let pbo0GpsWatchId = null;
let pbo0LastTechPos = null;

function initPBO0Map(arrets) {
  if (pbo0Map) { try { pbo0Map.remove(); } catch(e){} pbo0Map = null; }
  pbo0TechMarker = null; pbo0TechCircle = null;
  const valid = arrets.filter(a => a.lat && a.lng).sort((a,b) => (a.ordre||0) - (b.ordre||0));
  if (!valid.length) return;
  const center = [valid[0].lat, valid[0].lng];
  pbo0Map = L.map('pbo0-leaflet-map').setView(center, 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM', maxZoom: 19 }).addTo(pbo0Map);
  pbo0MapMarkers = [];
  const bounds = [];
  const routePoints = [];
  valid.forEach((a, idx) => {
    const v = a.terrain && a.terrain.statut ? pbo0VerdictMeta(a.terrain.statut) : null;
    const color = v ? v.color : '#003087';
    const lat = (a.terrain && a.terrain.lat_corr) ? a.terrain.lat_corr : a.lat;
    const lng = (a.terrain && a.terrain.lng_corr) ? a.terrain.lng_corr : a.lng;
    const icon = L.divIcon({
      html: `<div style="background:${color};color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">${a.ordre || (idx+1)}</div>`,
      className: '', iconSize: [32,32], iconAnchor: [16,16]
    });
    const mk = L.marker([lat, lng], { icon }).addTo(pbo0Map);
    const adr = a.adresses[0] || {};
    mk.bindPopup(`
      <div style="font-family:system-ui,sans-serif;min-width:200px">
        <div style="font-weight:700;font-size:13px;color:#003087;margin-bottom:4px">N°${a.ordre} · ${a.pbo_id}</div>
        <div style="font-size:12px;font-weight:700;margin-bottom:2px">${adr.adresse || ''}</div>
        <div style="font-size:11px;color:#666;margin-bottom:4px">${adr.code_postal || ''} ${adr.commune || ''}</div>
        <div style="font-size:11px;color:#666;margin-bottom:6px">🏠 ${a.nb_logements} logements${a.adresses.length>1?` · ${a.adresses.length} adresses`:''}</div>
        ${v ? `<div style="font-weight:700;color:${v.color};font-size:11px;margin-bottom:6px">${v.emoji} ${v.label}</div>` : '<div style="font-style:italic;color:#999;font-size:11px;margin-bottom:6px">Non traité</div>'}
        <button onclick="setPBO0View('list','${currentPBO0Mission?.id||''}');setTimeout(()=>document.getElementById('pbo0-card-${idx}')?.scrollIntoView({behavior:'smooth',block:'center'}),200)" style="padding:6px 10px;background:#003087;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700">Voir détail</button>
      </div>
    `);
    pbo0MapMarkers.push(mk);
    bounds.push([lat, lng]);
    routePoints.push([lat, lng]);
  });
  // Itinéraire ordonné (polyline bleue)
  if (routePoints.length > 1) {
    L.polyline(routePoints, { color: '#003087', weight: 4, opacity: 0.7, dashArray: '8,6' }).addTo(pbo0Map);
    // Petites flèches de direction sur les segments
    for (let i = 0; i < routePoints.length - 1; i++) {
      const mid = [(routePoints[i][0]+routePoints[i+1][0])/2, (routePoints[i][1]+routePoints[i+1][1])/2];
      const arrowIcon = L.divIcon({
        html: '<div style="color:#003087;font-size:18px;font-weight:900;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff">▶</div>',
        className: '', iconSize: [20,20], iconAnchor: [10,10]
      });
      L.marker(mid, { icon: arrowIcon, interactive: false }).addTo(pbo0Map);
    }
  }
  if (bounds.length > 1) pbo0Map.fitBounds(bounds, { padding: [40,40] });
  // Restaurer position tech si déjà connue
  if (pbo0LastTechPos) updateTechPosOnMap(pbo0LastTechPos.lat, pbo0LastTechPos.lng, pbo0LastTechPos.acc);
}

function togglePBO0GPS() {
  const btn = document.getElementById('pbo0-toggle-gps');
  if (pbo0GpsWatchId !== null) {
    navigator.geolocation.clearWatch(pbo0GpsWatchId);
    pbo0GpsWatchId = null;
    if (btn) { btn.textContent = '🛰 Activer GPS'; btn.style.background = 'var(--blue)'; }
    const el = document.getElementById('pbo0-tech-pos');
    if (el) el.textContent = '📡 GPS désactivé';
    if (pbo0TechMarker) { pbo0Map.removeLayer(pbo0TechMarker); pbo0TechMarker = null; }
    if (pbo0TechCircle) { pbo0Map.removeLayer(pbo0TechCircle); pbo0TechCircle = null; }
    return;
  }
  if (!navigator.geolocation) { alert('GPS non disponible.'); return; }
  if (btn) { btn.textContent = '⏸ Désactiver GPS'; btn.style.background = '#16A34A'; }
  pbo0GpsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      pbo0LastTechPos = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      updateTechPosOnMap(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
    },
    (err) => {
      const el = document.getElementById('pbo0-tech-pos');
      if (el) el.textContent = '⚠ Erreur GPS : ' + err.message;
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
  );
}

function updateTechPosOnMap(lat, lng, acc) {
  if (!pbo0Map) return;
  // Pastille bleue pulsante
  if (!pbo0TechMarker) {
    const icon = L.divIcon({
      html: `<div style="position:relative;width:24px;height:24px">
        <div style="position:absolute;inset:0;background:#1565C0;border-radius:50%;width:24px;height:24px;border:3px solid #fff;box-shadow:0 0 8px rgba(21,101,192,.8);z-index:2"></div>
        <div style="position:absolute;inset:-6px;background:rgba(21,101,192,.3);border-radius:50%;animation:pulse 2s infinite;z-index:1"></div>
      </div>`,
      className: '', iconSize: [24,24], iconAnchor: [12,12]
    });
    pbo0TechMarker = L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(pbo0Map);
    pbo0TechMarker.bindPopup('<b>📡 Votre position</b>');
    pbo0TechCircle = L.circle([lat, lng], { radius: acc || 20, color: '#1565C0', fillColor: '#1565C0', fillOpacity: 0.1, weight: 1 }).addTo(pbo0Map);
  } else {
    pbo0TechMarker.setLatLng([lat, lng]);
    if (pbo0TechCircle) pbo0TechCircle.setLatLng([lat, lng]).setRadius(acc || 20);
  }
  // Détection PBO proche (< 30m)
  const arrets = currentPBO0Mission ? getPBO0Arrets(currentPBO0Mission) : [];
  let closest = null, closestDist = Infinity;
  arrets.forEach((a, idx) => {
    if (!a.lat || !a.lng) return;
    const aLat = (a.terrain && a.terrain.lat_corr) ? a.terrain.lat_corr : a.lat;
    const aLng = (a.terrain && a.terrain.lng_corr) ? a.terrain.lng_corr : a.lng;
    const d = haversineDist(lat, lng, aLat, aLng);
    if (d < closestDist) { closestDist = d; closest = { a, idx, d }; }
  });
  const el = document.getElementById('pbo0-tech-pos');
  if (el) {
    let html = `📡 ${lat.toFixed(5)}, ${lng.toFixed(5)} ${acc?`(±${Math.round(acc)}m)`:''}`;
    if (closest && closest.d < 30) {
      html += ` · <b style="color:#16A34A">🎯 Près de N°${closest.a.ordre} (${Math.round(closest.d)}m)</b>`;
    } else if (closest) {
      html += ` · Plus proche : N°${closest.a.ordre} (${Math.round(closest.d)}m)`;
    }
    el.innerHTML = html;
  }
}

function haversineDist(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function setPBO0View(view, missionId) {
  pbo0View = view;
  const m = missions.find(x => x.id === missionId);
  if (m) renderPBO0Detail(m);
}

let currentPBO0Mission = null;
async function setPBO0Verdict(idx, statut) {
  const m = currentPBO0Mission || missions.find(x => x.statut === 'en-cours' && x.type_audit === 'PBO0');
  if (!m) return;
  const arrets = getPBO0Arrets(m);
  if (!arrets[idx]) return;
  if (!arrets[idx].terrain) arrets[idx].terrain = { statut: null, lat_corr: null, lng_corr: null, note: '', date: null };
  arrets[idx].terrain.statut = statut;
  arrets[idx].terrain.date = new Date().toISOString();
  m.pm_data = { ...(m.pm_data||{}), pbo0_arrets: arrets };
  await sb.from('missions').update({ pm_data: m.pm_data }).eq('id', m.id);
  renderPBO0Detail(m);
}

async function savePBO0Note(idx, note) {
  const m = currentPBO0Mission || missions.find(x => x.statut === 'en-cours' && x.type_audit === 'PBO0');
  if (!m) return;
  const arrets = getPBO0Arrets(m);
  if (!arrets[idx]) return;
  if (!arrets[idx].terrain) arrets[idx].terrain = { statut: null, lat_corr: null, lng_corr: null, note: '', date: null };
  arrets[idx].terrain.note = note;
  m.pm_data = { ...(m.pm_data||{}), pbo0_arrets: arrets };
  await sb.from('missions').update({ pm_data: m.pm_data }).eq('id', m.id);
}

async function capturePBO0Photo(idx, file) {
  if (!file) return;
  const m = currentPBO0Mission || missions.find(x => x.statut === 'en-cours' && x.type_audit === 'PBO0');
  if (!m) return;
  const statusEl = document.getElementById('pbo0-photo-status-' + idx);
  if (statusEl) statusEl.textContent = '📡 Capture de la position GPS...';
  if (!navigator.geolocation) { alert('GPS non disponible sur cet appareil.'); return; }
  // 1. Capturer la position GPS au moment de la photo
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const arrets = getPBO0Arrets(m);
    if (!arrets[idx]) return;
    if (!arrets[idx].terrain) arrets[idx].terrain = { statut: 'coord_modif', lat_corr: null, lng_corr: null, note: '', date: null };
    arrets[idx].terrain.lat_corr = pos.coords.latitude;
    arrets[idx].terrain.lng_corr = pos.coords.longitude;
    arrets[idx].terrain.gps_acc = pos.coords.accuracy;
    arrets[idx].terrain.date = new Date().toISOString();
    if (statusEl) statusEl.textContent = '📤 Envoi de la photo...';
    // 2. Upload de la photo dans le bucket
    try {
      const safeName = file.name.replace(/[^a-z0-9.]/gi, '_');
      const path = m.id + '/pbo0/' + arrets[idx].pbo_id.replace(/[^a-z0-9]/gi,'_') + '_' + Date.now() + '_' + safeName;
      const { error: upErr } = await sb.storage.from('photos').upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) {
        console.error('Upload photo PBO0:', upErr);
        if (statusEl) statusEl.textContent = '⚠ Position OK mais photo non envoyée';
      } else {
        const { data: urlData } = sb.storage.from('photos').getPublicUrl(path);
        arrets[idx].terrain.photo_url = urlData.publicUrl;
        arrets[idx].terrain.photo_path = path;
      }
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent = '⚠ Position OK mais photo non envoyée';
    }
    // 3. Sauvegarde
    m.pm_data = { ...(m.pm_data||{}), pbo0_arrets: arrets };
    await sb.from('missions').update({ pm_data: m.pm_data }).eq('id', m.id);
    renderPBO0Detail(m);
  }, (err) => {
    alert('Erreur GPS : ' + err.message + '\nLa position n\'a pas pu être capturée.');
    if (statusEl) statusEl.textContent = '⚠ Erreur GPS';
  }, { enableHighAccuracy: true, timeout: 15000 });
}

async function finishPBO0Mission(id) {
  const m = missions.find(x => x.id === id);
  if (!m) return;
  const arrets = getPBO0Arrets(m);
  const traites = arrets.filter(a => a.terrain && a.terrain.statut).length;
  if (traites < arrets.length) {
    if (!confirm(`${arrets.length - traites} PBO non traité(s). Terminer quand même ?`)) return;
  }
  await updateMissionStatus(id, 'termine');
  await loadMyMissions();
  renderMissionDetail(missions.find(x => x.id === id));
  renderTechMissions();
}

function exportPBO0CSV(id) {
  const m = missions.find(x => x.id === id);
  if (!m) return;
  const arrets = getPBO0Arrets(m);
  const rows = [['ordre','pbo_id','lat_origine','lng_origine','adresse','code_postal','commune','nb_logements','verdict_terrain','lat_corrigee','lng_corrigee','photo_url','note_terrain','date_audit']];
  arrets.forEach(a => {
    const adr = a.adresses[0] || {};
    const t = a.terrain || {};
    const v = t.statut ? pbo0VerdictMeta(t.statut) : null;
    rows.push([a.ordre, a.pbo_id, a.lat, a.lng, adr.adresse||'', adr.code_postal||'', adr.commune||'', a.nb_logements, v?v.label:'', t.lat_corr||'', t.lng_corr||'', t.photo_url||'', (t.note||'').replace(/[\r\n;]/g,' '), t.date||'']);
  });
  const csv = rows.map(r => r.map(c => `"${(c+'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `tournee_pbo0_${m.ref_pm}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

async function startAudit(id) {
  const m = missions.find(x => x.id === id);
  if (!m) return;
  if (m.statut === 'attente') {
    await updateMissionStatus(id, 'en-cours');
    await loadMyMissions();
  }
  const updM = missions.find(x => x.id === id);
  // PBO0: no PM/PBO data loading, just render the dedicated view
  if (updM && updM.type_audit === 'PBO0') {
    currentPBO0Mission = updM;
    renderMissionDetail(updM);
    renderTechMissions();
    return;
  }
  renderMissionDetail(updM);
  renderTechMissions();
  // Load PBO data into audit tool
  if (updM?.pbo_data?.length > 0) {
    // Restore PM data if mission has it (for PM-type audits)
    if(updM.pm_data){
      pmData=updM.pm_data;
      renderPM(updM.pm_filename||'PM importé');
    }
    // Restore commandes data if mission has it
    if(updM.cmd_data){
      cmdData=updM.cmd_data;
      analyseCommandes();
    }
    // Load existing photos from DB for this mission
    const{data:photoData}=await sb.from('photos').select('*').eq('mission_id',updM.id);
    if(photoData){
      photoData.forEach(p=>{
        if(p.pbo_id){
          const pbo=updM.pbo_data.find(pb=>pb.id===p.pbo_id);
          if(pbo){
            const{data:urlData}=sb.storage.from('photos').getPublicUrl(p.storage_path);
            if(!pboPhotos[pbo.reference_pbo])pboPhotos[pbo.reference_pbo]=[];
            pboPhotos[pbo.reference_pbo].push({name:p.nom_fichier||'photo',url:urlData.publicUrl,path:p.storage_path,dataUrl:urlData.publicUrl});
          }
        }
      });
    }
    pboData = updM.pbo_data.map(p => ({
      reference_pbo: p.reference_pbo,
      cable: p.cable || '',
      couleur_tube: p.couleur_tube || '',
      audite: p.audite || false,
      audite_date: p.audite_date || '',
      pbo_db_id: p.id,
      fibres: (p.fibres || []).map(f => ({
        id: f.id,
        num: f.num_fibre || '',
        cfpbo: f.couleur_fibre_pbo || '',
        ctpm: f.couleur_tube_pm || '',
        cfpm: f.couleur_fibre_pm || '',
        modpm: f.reference_module_pm || '',
        pospm: f.position_module_pm || '',
        client: f.client_actif || 'Non',
        pto: f.reference_pto || '',
        conformite: f.conformite || 'Non verifie',
        note: f.note || ''
      }))
    }));
    document.getElementById('pbo-result').style.display = 'block';
    document.getElementById('pbo-no-mission').style.display = 'none';
    document.getElementById('pbo-fname').textContent = updM.ref_pm + ' — zone arrière';
    filterPBOs(); updatePBOStats();
    // Configure tabs based on mission type
    const tabs = document.querySelectorAll('.ae-tab');
    const tabPM = tabs[0], tabPBO = tabs[1];
    if (updM.type_audit === 'PM') {
      // Visuel PM only
      tabPM.style.display = 'inline-flex'; tabPBO.style.display = 'none';
      showAETab('pm', tabPM);
      isHSMode = false; hsFibres = {}; hsSelected.clear();
    } else if (updM.type_audit === 'PBO') {
      // Zone arrière PBO only
      tabPM.style.display = 'none'; tabPBO.style.display = 'inline-flex';
      showAETab('pbo', tabPBO);
    } else if (updM.type_audit === 'HS') {
      // Audit fibres HS - PM tab with grid clickable
      tabPM.style.display = 'inline-flex'; tabPBO.style.display = 'none';
      showAETab('pm', tabPM);
      isHSMode = true;
      hsFibres = updM.hs_fibres || {};
      hsSelected.clear();
      document.body.classList.add('hs-mode');
      // Show global CSV button if hs data
      setTimeout(()=>updateHSStatsOnly(),200);
      // Hide commandes operateurs module for HS audit
      const cmdMod = document.getElementById('cmd-module');
      if (cmdMod) cmdMod.style.display = 'none';
      // Auto-build pmData from pbo_data fibres (ROP file already has all PM positions)
      if (updM.pbo_data?.length > 0) {
        pmData = {};
        updM.pbo_data.forEach(pbo => {
          (pbo.fibres || []).forEach(f => {
            // Module format: "B2-T2-MODULE-A" → tiroir = T2, row letter = last char (A,B,C...)
            const mod = f.reference_module_pm || '';
            const tMatch = mod.match(/T(\d+)/);
            const letterMatch = mod.match(/MODULE-([A-Z])/);
            if (!tMatch || !letterMatch) return;
            const tiroir = tMatch[1];
            const rowLetter = letterMatch[1];
            const colNum = parseInt(f.position_module_pm) || 0;
            if (!colNum) return;
            const positionKey = rowLetter + (colNum < 10 ? '0' + colNum : colNum);
            if (!pmData[tiroir]) pmData[tiroir] = {};
            pmData[tiroir][positionKey] = {
              couleur: f.couleur_fibre_pm || f.couleur_fibre_pbo || '',
              ssn: f.reference_pto || 'Pas de N°',
              tube: f.couleur_tube_pm || '',
              ref_pbo: pbo.reference_pbo || '',
              couleur_pbo: f.couleur_fibre_pbo || '',
              tube_pbo: pbo.couleur_tube || '',
              id_pbo: pbo.id_pbo || pbo.pbo_db_id || '',
              num_fibre_pbo: f.num_fibre || '',
              module_pm: f.reference_module_pm || '',
              id_rop: f.id_rop || ''
            };
          });
        });
        // Render PM grid
        renderPM(updM.ref_pm + ' (depuis ROP)');
      }
      // Show HS stats bar
      setTimeout(()=>{
        const stEl=document.getElementById('pm-result');
        if(stEl && !document.getElementById('hs-stats-bar')){
          const hsBar=document.createElement('div');
          hsBar.id='hs-stats-bar';
          hsBar.style.cssText='background:#fff;border:1px solid var(--gray3);border-radius:8px;padding:10px 14px;margin-bottom:10px';
          stEl.insertBefore(hsBar,stEl.firstChild);
          updateHSStats();
        }
      },300);
    } else {
      // Complet: both tabs visible
      tabPM.style.display = 'inline-flex'; tabPBO.style.display = 'inline-flex';
      showAETab('pbo', tabPBO);
      isHSMode = false; hsFibres = {}; hsSelected.clear();
    }
  } else {
    pboData = [];
    document.getElementById('pbo-result').style.display = 'none';
    document.getElementById('pbo-no-mission').style.display = 'block';
    // No PBO data — if mission is PM type, show only PM tab
    const tabs = document.querySelectorAll('.ae-tab');
    const tabPM = tabs[0], tabPBO = tabs[1];
    if (updM.type_audit === 'PM') {
      tabPM.style.display = 'inline-flex'; tabPBO.style.display = 'none';
      showAETab('pm', tabPM);
    } else {
      tabPM.style.display = 'inline-flex'; tabPBO.style.display = 'inline-flex';
    }
  }
  document.querySelector('.tech-divider').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════
// RAPPORT BE
// ══════════════════════════════════════════════
async function openRapportPM(missionId){
  const m=missions.find(x=>x.id===missionId);
  if(!m){alert('Mission introuvable.');return;}
  if(!m.pm_data && !(m.type_audit==='HS' && m.pbo_data?.length>0)){alert('Aucun rapport disponible pour cette mission.');return;}
  // Restore state
  selectedMissionId=missionId;
  pmData=m.pm_data;
  cmdData=m.cmd_data||null;
  hsFibres=m.hs_fibres||{};
  isHSMode=m.type_audit==='HS';
  // Pour les missions HS sans pm_data, on construit la grille depuis pbo_data
  if(isHSMode && m.pbo_data?.length>0){
    pmData=null; // force rebuild
    pmData={};
    m.pbo_data.forEach(pbo=>{
      (pbo.fibres||[]).forEach(f=>{
        const mod=f.reference_module_pm||'';
        const tMatch=mod.match(/T(\d+)/);
        const letterMatch=mod.match(/MODULE-([A-Z])/);
        if(!tMatch||!letterMatch)return;
        const tiroir=tMatch[1];
        const rowLetter=letterMatch[1];
        const colNum=parseInt(f.position_module_pm)||0;
        if(!colNum)return;
        const positionKey=rowLetter+(colNum<10?'0'+colNum:colNum);
        if(!pmData[tiroir])pmData[tiroir]={};
        pmData[tiroir][positionKey]={
          couleur:f.couleur_fibre_pm||f.couleur_fibre_pbo||'',
          ssn:f.reference_pto||'Pas de N°',
          tube:f.couleur_tube_pm||'',
          ref_pbo:pbo.reference_pbo||'',
          couleur_pbo:f.couleur_fibre_pbo||'',
          tube_pbo:pbo.couleur_tube||'',
          num_fibre_pbo:f.num_fibre||'',
          module_pm:f.reference_module_pm||'',
          id_rop:f.id_rop||''
        };
      });
    });
  }
  if(cmdData)analyseCommandes();else cmdAnalysis=null;
  // Compute stats
  const SOLID={rouge:'#ef4444',vert:'#22c55e',bleu:'#003087',jaune:'#f59e0b',violet:'#8b5cf6',blanc:'#9ca3af',orange:'#f97316',noir:'#374151',turquoise:'#06b6d4',rose:'#ec4899'};
  const sol=c=>SOLID[(c||'').toLowerCase()]||'#888';
  let total=0,libres=0,colors={};
  Object.keys(pmData).forEach(t=>{
    Object.keys(pmData[t]).forEach(p=>{
      if(!/^[A-Z]\d+$/i.test(p))return;
      total++;
      const c=pmData[t][p].couleur||'';
      if(c==='*')libres++;
      else colors[c]=(colors[c]||0)+1;
    });
  });
  const occupees=total-libres;
  const pct=total>0?Math.round(occupees/total*100):0;
  const tiroirs=Object.keys(pmData).length;
  // Tiroirs cards with grid
  function colBg(c){if(!c||c==='*')return 'rgba(26,124,62,.08)';return sol(c)+'33';}
  function colBd(c){if(!c||c==='*')return 'rgba(26,124,62,.4)';return sol(c);}
  function colTx(c){if(!c||c==='*')return '#1a7c3e';const lc=(c||'').toLowerCase();if(lc==='blanc'||lc==='jaune')return '#374151';return sol(c);}
  function colInit(c){if(!c||c==='*')return '';return c.substring(0,2).toUpperCase();}
  const tirHtml=Object.keys(pmData).sort((a,b)=>+a-+b).map(t=>{
    const d=pmData[t];
    const positions=Object.keys(d).filter(p=>/^[A-Z]\d+$/i.test(p));
    const tL=positions.filter(p=>d[p].couleur==='*').length;
    const tO=positions.length-tL;
    const rowKeys=[...new Set(positions.map(p=>p[0]))].sort();
    const maxCol=positions.length>0?Math.max(...positions.map(p=>parseInt(p.slice(1)))):0;
    // Build grid
    let gridHtml='<div style="overflow-x:auto;padding:14px 0"><table style="border-collapse:separate;border-spacing:2px;font-family:monospace;font-size:9px"><thead><tr><td></td>';
    for(let col=1;col<=maxCol;col++){
      gridHtml+='<td style="text-align:center;color:#94a3b8;font-size:8px;padding:0 2px;min-width:18px">'+(col<10?'0'+col:col)+'</td>';
    }
    gridHtml+='</tr></thead><tbody>';
    rowKeys.forEach(row=>{
      gridHtml+='<tr><td style="color:#94a3b8;font-weight:700;padding-right:4px;font-size:9px">'+row+'</td>';
      for(let col=1;col<=maxCol;col++){
        // Try multiple formats: A1, A01
        let cell=d[row+col]||d[row+(col<10?'0'+col:col)];
        const pos=row+(col<10?'0'+col:col);
        if(cell){
          const c=cell.couleur||'';
          const isLibre=c==='*';
          const hsKey=t+'_'+pos;
          const hsInfo=hsFibres[hsKey];
          const hsBadge=hsInfo?(hsInfo.fibre_HS==='Oui'?'<span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;background:#A32D2D;color:#fff;border-radius:50%;font-size:7px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fff">⚠</span>':'<span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;background:#1A7C3E;color:#fff;border-radius:50%;font-size:7px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fff">✓</span>'):'';
          const outline=hsInfo?(hsInfo.fibre_HS==='Oui'?';outline:1.5px solid #A32D2D;outline-offset:1px':';outline:1.5px solid #1A7C3E;outline-offset:1px'):'';
          const tt='Position '+pos+(cell.ssn?' / SSN: '+cell.ssn:'')+(hsInfo?(' / '+(hsInfo.fibre_HS==='Oui'?'HS - '+hsInfo.motif:'OK')):'');
          gridHtml+='<td style="position:relative;padding:0"><div title="'+tt+'" style="background:'+colBg(c)+';border:1px solid '+colBd(c)+';color:'+colTx(c)+';width:18px;height:14px;text-align:center;font-size:8px;font-weight:700;border-radius:2px;position:relative'+outline+'">'+(isLibre?'':colInit(c))+hsBadge+'</div></td>';
        }else{
          gridHtml+='<td style="width:18px;height:14px"></td>';
        }
      }
      gridHtml+='</tr>';
    });
    gridHtml+='</tbody></table></div>';
    // Build badges based on mode
    let badgesH = '';
    if(isHSMode){
      const aud=Object.keys(hsFibres).filter(k=>k.startsWith(t+'_')).length;
      const hs=Object.entries(hsFibres).filter(([k,v])=>k.startsWith(t+'_')&&v.fibre_HS==='Oui').length;
      const ok=Object.entries(hsFibres).filter(([k,v])=>k.startsWith(t+'_')&&v.fibre_HS==='Non').length;
      badgesH = '<span style="font-size:11px;padding:2px 8px;background:rgba(0,48,135,.08);color:#003087;border:1px solid rgba(0,48,135,.2);border-radius:4px;font-family:monospace;font-weight:700">'+aud+' aud.</span><span style="font-size:11px;padding:2px 8px;background:#fee2e2;color:#A32D2D;border:1px solid #fca5a5;border-radius:4px;font-family:monospace;font-weight:700">⚠ '+hs+' HS</span><span style="font-size:11px;padding:2px 8px;background:#dcfce7;color:#15803d;border:1px solid #86efac;border-radius:4px;font-family:monospace;font-weight:700">✓ '+ok+' OK</span>';
    }else{
      badgesH = '<span style="font-size:11px;padding:2px 8px;background:#dcfce7;color:#15803d;border:1px solid #86efac;border-radius:4px;font-family:monospace;font-weight:700">● '+tL+' libres</span><span style="font-size:11px;padding:2px 8px;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:4px;font-family:monospace;font-weight:700">● '+tO+' occup.</span>';
    }
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:10px;overflow:hidden"><div onclick="var b=this.nextElementSibling;b.style.display=b.style.display===\'none\'?\'block\':\'none\';this.querySelector(\'.tir-arr\').textContent=b.style.display===\'none\'?\'▼\':\'▲\'" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;flex-wrap:wrap;gap:10px"><div style="font-weight:700;font-family:monospace;font-size:14px">TIROIR '+t+' <span style="color:#94a3b8;font-weight:400;font-size:11px">'+rowKeys.length+' rg · '+maxCol+' col</span></div><div style="display:flex;gap:8px;align-items:center">'+badgesH+'<span class="tir-arr" style="color:#94a3b8;margin-left:4px">▼</span></div></div><div style="display:none;padding:0 18px 14px 18px;border-top:1px solid #f1f5f9">'+gridHtml+'</div></div>';
  }).join('');
  // Legend
  const legendHtml=Object.keys(colors).sort((a,b)=>colors[b]-colors[a]).map(c=>'<span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-family:monospace;background:#f8fafc;border:1px solid #e2e8f0;padding:4px 10px;border-radius:6px"><span style="width:10px;height:10px;border-radius:50%;background:'+sol(c)+'"></span>'+c+' ('+colors[c]+')</span>').join('');
  // HS Audit Section if HS mode
  let hsDetailsHtml='';
  if(isHSMode && Object.keys(hsFibres).length>0){
    const hsCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length;
    const okCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length;
    const totalAud=Object.keys(hsFibres).length;
    let rows='';
    Object.entries(hsFibres).sort(([a],[b])=>a.localeCompare(b)).forEach(([key,f])=>{
      const posInfo=pmData?.[f.tiroir]?.[f.position]||{};
      const isHS=f.fibre_HS==='Oui';
      rows+='<tr style="background:'+(isHS?'#FCEBEB':'#F0F9F4')+'">'+
        '<td style="padding:6px 9px;font-family:monospace;text-align:center;font-weight:700">T'+f.tiroir+'</td>'+
        '<td style="padding:6px 9px;font-family:monospace;text-align:center;font-weight:700">'+f.position+'</td>'+
        '<td style="padding:6px 9px"><span style="display:inline-flex;align-items:center;gap:4px;font-size:11px"><span style="width:8px;height:8px;border-radius:50%;background:'+sol(f.couleur)+';display:inline-block"></span>'+(f.couleur||'—')+'</span></td>'+
        '<td style="padding:6px 9px;font-size:10px;font-family:monospace">'+(posInfo.ref_pbo||'—')+'</td>'+
        '<td style="padding:6px 9px;font-size:10px;font-family:monospace">'+(posInfo.id_rop||'—')+'</td>'+
        '<td style="padding:6px 9px;font-size:10px;font-family:monospace">'+(f.ssn||'—')+'</td>'+
        '<td style="padding:6px 9px;text-align:center"><span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;'+(isHS?'background:#A32D2D;color:#fff':'background:#1A7C3E;color:#fff')+'">'+(isHS?'⚠ HS':'✓ OK')+'</span></td>'+
        '<td style="padding:6px 9px;font-size:11px;font-weight:600">'+(f.motif||'—')+'</td>'+
        '<td style="padding:6px 9px;font-size:10px;color:#64748b;font-style:italic">'+(f.note||'—')+'</td>'+
      '</tr>';
    });
    hsDetailsHtml='<div style="padding:24px 32px;border-top:1px solid #e2e8f0">'+
      '<div style="font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px">Audit fibres HS</div>'+
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">'+
        '<div style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid var(--blue);padding:12px;border-radius:0"><div style="font-size:10px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px">Auditées</div><div style="font-size:22px;font-weight:900;color:var(--blue)">'+totalAud+'</div></div>'+
        '<div style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid #A32D2D;padding:12px;border-radius:0"><div style="font-size:10px;color:#A32D2D;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Fibres HS</div><div style="font-size:22px;font-weight:900;color:#A32D2D">'+hsCount+'</div></div>'+
        '<div style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid #1A7C3E;padding:12px;border-radius:0"><div style="font-size:10px;color:#1A7C3E;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Fibres OK</div><div style="font-size:22px;font-weight:900;color:#1A7C3E">'+okCount+'</div></div>'+
      '</div>'+
      '<div style="overflow-x:auto;background:#fff;border:1px solid #e2e8f0;border-radius:8px"><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:8px 9px;text-align:center">Tiroir</th><th style="padding:8px 9px;text-align:center">Pos.</th><th style="padding:8px 9px;text-align:left">Couleur</th><th style="padding:8px 9px;text-align:left">Réf PBO</th><th style="padding:8px 9px;text-align:left">ID ROP</th><th style="padding:8px 9px;text-align:left">PTO</th><th style="padding:8px 9px;text-align:center">Statut</th><th style="padding:8px 9px;text-align:left">Motif</th><th style="padding:8px 9px;text-align:left">Note</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '</div>';
  }

  // Surplus section if cmd available
  let surplusHtml='';
  if(cmdAnalysis){
    const totalSurplus=Object.values(cmdAnalysis).filter(a=>a.surplus).reduce((s,a)=>s+a.diff,0);
    const OPC={'FREE':{bg:'#FCEBEB',bd:'#E24B4A',tx:'#A32D2D',label:'FREE · ROUGE'},'ORANGE':{bg:'#FAEEDA',bd:'#EF9F27',tx:'#854F0B',label:'ORANGE'},'BOUYGUES':{bg:'#EAF3DE',bd:'#97C459',tx:'#3B6D11',label:'BOUYGUES · VERT'},'SFR':{bg:'#E6F1FB',bd:'#378ADD',tx:'#185FA5',label:'SFR · BLEU'}};
    let cards='';
    Object.keys(OPC).forEach(op=>{
      const a=cmdAnalysis[op],col=OPC[op];
      cards+='<div style="background:#fff;border:1px solid #e2e8f0;border-left:3px solid '+col.bd+';padding:12px;border-radius:6px"><div style="font-size:10px;color:'+col.tx+';font-weight:700;letter-spacing:.5px">'+col.label+'</div><div style="display:flex;align-items:baseline;gap:4px;margin-top:4px"><span style="font-size:20px;font-weight:900">'+a.terrain+'</span><span style="font-size:11px;color:#94a3b8">/ '+a.commandes+' cmd</span></div><div style="font-size:11px;color:'+(a.surplus?'#dc2626':'#15803d')+';margin-top:3px;font-weight:700">'+(a.surplus?'⚠ +'+a.diff+' surplus':(a.diff===0?'✓ Égal':'✓ '+a.diff+' OK'))+'</div></div>';
    });
    let opDetails='';
    Object.keys(OPC).forEach(op=>{
      const a=cmdAnalysis[op];
      if(!a.surplus)return;
      const col=OPC[op];
      const positions=a.positionsPasDeNo.slice().sort((x,y)=>{if(x.tiroir!==y.tiroir)return parseInt(x.tiroir)-parseInt(y.tiroir);return x.position.localeCompare(y.position);});
      if(positions.length===0){
        opDetails+='<div style="background:'+col.bg+';padding:10px 14px;border-radius:6px;border:1px solid '+col.bd+';margin-bottom:10px"><div style="font-size:13px;font-weight:800;color:'+col.tx+'">'+op+' — Aucune position sans n°</div><div style="font-size:11px;color:#64748b;margin-top:4px;font-style:italic">+'+a.diff+' surplus avec SSN identifié — investigation manuelle requise</div></div>';
        return;
      }
      const posHtml=positions.map(p=>'<div title="SSN: '+(p.ssn||'—')+'" style="background:'+col.bg+';color:'+col.tx+';padding:5px 7px;border-radius:3px;text-align:center;font-family:monospace;font-size:10px;font-weight:600">T'+p.tiroir+'·'+p.position+'</div>').join('');
      opDetails+='<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:10px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><span style="font-size:12px;font-weight:700">'+op+' — '+positions.length+' position'+(positions.length>1?'s':'')+' sans n° à investiguer</span><span style="font-size:10px;padding:2px 8px;background:'+col.bg+';color:'+col.tx+';border-radius:4px;font-family:monospace">+'+a.diff+' surplus</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:5px">'+posHtml+'</div></div>';
    });
    surplusHtml='<div style="padding:24px 32px;border-top:1px solid #e2e8f0"><div style="font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px">Analyse commandes opérateurs</div><div style="background:'+(totalSurplus>0?'#fef3c7':'#dcfce7')+';border:1px solid '+(totalSurplus>0?'#fde047':'#86efac')+';border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:12px;font-weight:700;color:'+(totalSurplus>0?'#854d0e':'#15803d')+'">'+(totalSurplus>0?'⚠️ '+totalSurplus+' jarretière'+(totalSurplus>1?'s':'')+' en surplus détectée'+(totalSurplus>1?'s':''):'✅ Aucun écart détecté')+'</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">'+cards+'</div>'+opDetails+'</div>';
  }
  // Build modal
  const modalHtml='<div id="rap-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto" onclick="if(event.target===this)document.getElementById(\'rap-overlay\').remove()">'+
    '<div style="background:#F4F6FA;border-radius:12px;max-width:1200px;width:100%;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3);margin:20px 0">'+
      '<div style="background:linear-gradient(135deg,#003087 0%,#1565C0 100%);color:#fff;padding:24px 32px;border-bottom:3px solid #E2001A;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">'+
        '<div>'+
          '<div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:.85;margin-bottom:4px">Rapport visualiseur PM</div>'+
          '<div style="font-size:26px;font-weight:900;letter-spacing:-.5px">'+m.ref_pm+'</div>'+
          '<div style="font-size:12px;opacity:.85;margin-top:4px">📍 '+(m.zone||'—')+' · '+(m.type_audit||'—')+'</div>'+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:8px">'+
          '<button onclick="exportPMPDF()" style="padding:10px 20px;background:#fff;color:#003087;border:none;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px;font-family:Syne,sans-serif">📄 Export PDF</button>'+
          '<button onclick="document.getElementById(\'rap-overlay\').remove()" style="width:36px;height:36px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer;font-weight:bold">✕</button>'+
        '</div>'+
      '</div>'+
      (isHSMode ? `<div style="background:#0a2456;color:#fff;padding:14px 32px;display:grid;grid-template-columns:repeat(6,1fr);gap:16px">
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Tiroirs</div><div style="font-size:22px;font-weight:900">${tiroirs}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Positions</div><div style="font-size:22px;font-weight:900">${total}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Auditées</div><div style="font-size:22px;font-weight:900;color:#93c5fd">${Object.keys(hsFibres).length}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:#fca5a5">Fibres HS</div><div style="font-size:22px;font-weight:900;color:#fca5a5">${Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;color:#86efac">Fibres OK</div><div style="font-size:22px;font-weight:900;color:#86efac">${Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Avancement</div><div style="font-size:22px;font-weight:900;color:#93c5fd">${occupees>0?Math.round(Object.keys(hsFibres).length/occupees*100):0}%</div></div>
      </div>` : '<div style="background:#0a2456;color:#fff;padding:14px 32px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px">'+
        '<div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Tiroirs</div><div style="font-size:22px;font-weight:900">'+tiroirs+'</div></div>'+
        '<div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Positions</div><div style="font-size:22px;font-weight:900">'+total+'</div></div>'+
        '<div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Libres</div><div style="font-size:22px;font-weight:900;color:#86efac">'+libres+'</div></div>'+
        '<div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Occupées</div><div style="font-size:22px;font-weight:900;color:#fbbf24">'+occupees+'</div></div>'+
        '<div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Occupation</div><div style="font-size:22px;font-weight:900;color:#93c5fd">'+pct+'%</div></div>'+
      '</div>')+
      '<div style="height:6px;background:#0a2456"><div style="height:100%;background:linear-gradient(90deg,#86efac,#fbbf24);width:'+pct+'%"></div></div>'+
      '<div style="padding:24px 32px">'+
        (isHSMode ? '' : '<div style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Légende</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">'+legendHtml+'</div>')+
        '<div style="font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px">Détail par tiroir ('+tiroirs+')</div>'+
        tirHtml+
      '</div>'+
      surplusHtml+
    '</div>'+
  '</div>';
  // Remove existing
  document.querySelectorAll('#rap-overlay').forEach(el=>el.remove());
  document.body.insertAdjacentHTML('beforeend',modalHtml);
}

function openRapport(missionId) {
  const m = missions.find(x => x.id === missionId);
  if (!m || !m.pbo_data?.length) { alert('Aucun rapport disponible.'); return; }
  const pboList = m.pbo_data;
  const audites = pboList.filter(p => p.audite).length;
  const totalF = pboList.reduce((s,p)=>s+(p.fibres?.length||0),0);
  const conf = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='Conforme').length||0),0);
  const amod = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='A modifier').length||0),0);
  const avPct = pboList.length > 0 ? Math.round(audites/pboList.length*100) : 0;
  const SOLID = {rouge:'#ef4444',vert:'#22c55e',bleu:'#003087',jaune:'#f59e0b',violet:'#8b5cf6',blanc:'#9ca3af',orange:'#f97316',noir:'#374151',turquoise:'#06b6d4',rose:'#ec4899'};
  function sol(c) { return SOLID[(c||'').toLowerCase()]||'#888'; }
  function cb(cf) {
    if(cf==='Conforme')return 'background:#dcfce7;color:#15803d;border:1px solid #86efac';
    if(cf==='A modifier')return 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5';
    return 'background:#f1f5f9;color:#64748b;border:1px solid #cbd5e1';
  }
  const pboCards = [...pboList].sort((a,b)=>{
    if(a.audite && !b.audite)return -1;
    if(!a.audite && b.audite)return 1;
    return (a.reference_pbo||'').localeCompare(b.reference_pbo||'');
  }).map((pbo,idx) => {
    const rows = [...(pbo.fibres||[])].sort((a,b)=>{
      const na=parseInt(a.num_fibre)||0,nb=parseInt(b.num_fibre)||0;
      if(na!==nb)return na-nb;
      return (parseInt(a.position_module_pm)||0)-(parseInt(b.position_module_pm)||0);
    }).map((f,fi) =>
      `<tr style="background:${fi%2===0?'#fff':'#f8fafc'}">
        <td style="padding:5px 9px;font-family:monospace;text-align:center;font-weight:700;font-size:10px">${f.num_fibre||'—'}</td>
        <td style="padding:5px 9px"><span style="display:inline-flex;align-items:center;gap:4px;font-size:10px"><span style="width:8px;height:8px;border-radius:50%;background:${sol(f.couleur_fibre_pbo)};display:inline-block;flex-shrink:0"></span>${f.couleur_fibre_pbo||'—'}</span></td>
        <td style="padding:5px 9px"><span style="display:inline-flex;align-items:center;gap:4px;font-size:10px"><span style="width:8px;height:8px;border-radius:50%;background:${sol(pbo.couleur_tube)};display:inline-block;flex-shrink:0"></span>${pbo.couleur_tube||'—'}</span></td>
        <td style="padding:5px 9px;font-size:9px;font-family:monospace">${f.reference_module_pm||'—'}</td>
        <td style="padding:5px 9px;text-align:center;font-weight:700;color:#1d4ed8;font-size:10px">${f.position_module_pm||'—'}</td>
        <td style="padding:5px 9px;font-size:9px;color:#475569">${f.reference_pto||'—'}</td>
        <td style="padding:5px 9px;text-align:center;font-weight:700;color:${f.client_actif==='Oui'?'#16a34a':'#94a3b8'};font-size:10px">${f.client_actif==='Oui'?'●':'○'}</td>
        <td style="padding:5px 9px"><span style="padding:2px 6px;border-radius:8px;font-size:9px;font-weight:700;${cb(f.conformite)}">${f.conformite==='Conforme'?'✓ Conforme':f.conformite==='A modifier'?'⚠ À modifier':'— Non vérifié'}</span></td>
        <td style="padding:5px 9px;font-size:9px;color:#64748b;font-style:italic">${f.note||''}</td>
      </tr>`
    ).join('');
    return `<div class="rap-pbo-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:10px;overflow:hidden">
      <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';this.querySelector('.rap-arr').textContent=this.nextElementSibling.style.display==='none'?'▼':'▲'" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;cursor:pointer;flex-wrap:wrap">
        <span style="width:10px;height:10px;border-radius:50%;background:${sol(pbo.couleur_tube)};display:inline-block;flex-shrink:0"></span>
        <span style="font-family:monospace;font-size:13px;font-weight:700;color:#0f172a">${pbo.reference_pbo}</span>
        <span style="font-size:11px;color:#64748b;font-family:monospace">${pbo.cable||''}</span>
        <span style="font-size:11px;color:#64748b">${pbo.fibres?.length||0} fibres</span>
        ${pbo.audite?`<span style="font-size:9px;font-weight:800;padding:2px 7px;border-radius:4px;background:#dcfce7;color:#15803d;border:1px solid #86efac">✓ Audité</span><span style="font-size:10px;color:#94a3b8;font-family:monospace">${pbo.audite_date?new Date(pbo.audite_date).toLocaleDateString('fr-FR'):''}</span>`:'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;background:#fef9c3;color:#854d0e;border:1px solid #fde047">⏳ En attente</span>'}
        <span class="rap-arr" style="margin-left:auto;color:#94a3b8">▼</span>
      </div>
      <div style="display:none;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:7px 9px;text-align:center;font-size:10px">N°</th><th style="padding:7px 9px;font-size:10px">Fibre PBO</th><th style="padding:7px 9px;font-size:10px">Tube PBO</th><th style="padding:7px 9px;font-size:10px">Module PM</th><th style="padding:7px 9px;text-align:center;font-size:10px">Pos.</th><th style="padding:7px 9px;font-size:10px">Réf PTO</th><th style="padding:7px 9px;text-align:center;font-size:10px">Client</th><th style="padding:7px 9px;font-size:10px">Conformité</th><th style="padding:7px 9px;font-size:10px">Note</th></tr></thead><tbody>${rows}</tbody></table></div>
    </div>`;
  }).join('');
  // Build modal
  const modalHtml = `<div id="rap-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto" onclick="if(event.target===this)document.getElementById('rap-overlay').remove()">
    <div style="background:#F4F6FA;border-radius:12px;max-width:1200px;width:100%;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3);margin:20px 0">
      <div style="background:linear-gradient(135deg,#003087 0%,#1565C0 100%);color:#fff;padding:24px 32px;border-bottom:3px solid #E2001A;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:.85;margin-bottom:4px">Rapport d\'audit terrain</div>
          <div style="font-size:26px;font-weight:900;letter-spacing:-.5px">${m.ref_pm}</div>
          <div style="font-size:12px;opacity:.85;margin-top:4px">📍 ${m.zone||'—'} · ${m.type_audit||'—'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button onclick="exportRapportPDF('${missionId}')" style="padding:10px 20px;background:#fff;color:#003087;border:none;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px;font-family:'Syne',sans-serif">📄 Export PDF</button>
          <button onclick="document.getElementById('rap-overlay').remove()" style="width:36px;height:36px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer;font-weight:bold">✕</button>
        </div>
      </div>
      <div style="background:#0a2456;color:#fff;padding:14px 32px;display:grid;grid-template-columns:repeat(6,1fr);gap:16px">
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">PBO Total</div><div style="font-size:22px;font-weight:900">${pboList.length}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Audités</div><div style="font-size:22px;font-weight:900;color:#fbbf24">${audites}/${pboList.length}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Avancement</div><div style="font-size:22px;font-weight:900;color:#93c5fd">${avPct}%</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Fibres</div><div style="font-size:22px;font-weight:900">${totalF}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">Conformes</div><div style="font-size:22px;font-weight:900;color:#86efac">${conf}</div></div>
        <div style="text-align:center"><div style="font-size:10px;opacity:.7;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">À modifier</div><div style="font-size:22px;font-weight:900${amod>0?';color:#fbbf24':''}">${amod}</div></div>
      </div>
      <div style="height:6px;background:#0a2456;position:relative"><div style="height:100%;background:linear-gradient(90deg,#86efac,#fbbf24);width:${avPct}%"></div></div>
      <div style="padding:24px 32px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div style="font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.5px">Détail par PBO (${pboList.length})</div>
          <div style="display:flex;gap:6px">
            <button onclick="document.querySelectorAll('#rap-overlay .rap-pbo-card > div:nth-child(2)').forEach(b=>b.style.display='block');document.querySelectorAll('#rap-overlay .rap-arr').forEach(a=>a.textContent='▲')" style="padding:6px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;font-size:11px;cursor:pointer;font-weight:600;font-family:'Syne',sans-serif">Tout ouvrir</button>
            <button onclick="document.querySelectorAll('#rap-overlay .rap-pbo-card > div:nth-child(2)').forEach(b=>b.style.display='none');document.querySelectorAll('#rap-overlay .rap-arr').forEach(a=>a.textContent='▼')" style="padding:6px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;font-size:11px;cursor:pointer;font-weight:600;font-family:'Syne',sans-serif">Tout fermer</button>
          </div>
        </div>
        ${pboCards}
      </div>
    </div>
  </div>`;
  // Remove any existing rapport overlay first
  document.querySelectorAll('#rap-overlay').forEach(el=>el.remove());
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeRapport(){
  const ov=document.getElementById('rap-overlay');
  if(ov)ov.remove();
}

function rStat(label, val, color) {
  return `<div style="text-align:center;padding:8px 4px;border-right:1px solid rgba(255,255,255,.06)"><div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#475569;font-family:monospace">${label}</div><div style="font-size:18px;font-weight:900;color:${color||'#e2e8f0'};margin-top:2px;letter-spacing:-.5px">${val}</div></div>`;
}
function toggleRPBO(sid) {
  const b = document.getElementById('rbody-'+sid), a = document.getElementById('rarr-'+sid);
  if (!b) return;
  const o = b.classList.toggle('open');
  if (a) a.classList.toggle('open', o);
}
function toggleAllRPBO(open) {
  document.querySelectorAll('.rapport-pbo-body').forEach(b => b.classList.toggle('open', open));
  document.querySelectorAll('.rapport-pbo-arrow').forEach(a => a.classList.toggle('open', open));
}
function closeRapport() { document.getElementById('rapport-overlay').classList.remove('open'); document.body.style.overflow = ''; }

// ══════════════════════════════════════════════
// COLOUR MAP & UTILS
// ══════════════════════════════════════════════
const CMAP = {
  orange:{bg:'rgba(249,115,22,.12)',bd:'rgba(249,115,22,.4)',tx:'#EA580C',dot:'#EA580C',lbl:'OR',cls:'orange'},
  bleu:{bg:'rgba(0,48,135,.1)',bd:'rgba(0,48,135,.3)',tx:'#003087',dot:'#003087',lbl:'BL',cls:'bleu'},
  vert:{bg:'rgba(34,197,94,.1)',bd:'rgba(34,197,94,.35)',tx:'#16A34A',dot:'#16A34A',lbl:'VT',cls:'vert'},
  rouge:{bg:'rgba(226,0,26,.1)',bd:'rgba(226,0,26,.3)',tx:'#E2001A',dot:'#E2001A',lbl:'RG',cls:'rouge'},
  violet:{bg:'rgba(139,92,246,.12)',bd:'rgba(139,92,246,.35)',tx:'#7C3AED',dot:'#7C3AED',lbl:'VI',cls:'violet'},
  jaune:{bg:'rgba(245,158,11,.12)',bd:'rgba(245,158,11,.4)',tx:'#B45309',dot:'#B45309',lbl:'JA',cls:'jaune'},
  blanc:{bg:'rgba(148,163,184,.1)',bd:'rgba(148,163,184,.3)',tx:'#64748B',dot:'#94A3B8',lbl:'BK',cls:'blanc'},
  noir:{bg:'rgba(55,65,81,.12)',bd:'rgba(55,65,81,.4)',tx:'#374151',dot:'#4B5563',lbl:'NK',cls:'noir'},
  turquoise:{bg:'rgba(6,182,212,.1)',bd:'rgba(6,182,212,.35)',tx:'#0891B2',dot:'#06B6D4',lbl:'TQ',cls:'turquoise'},
  rose:{bg:'rgba(236,72,153,.1)',bd:'rgba(236,72,153,.3)',tx:'#BE185D',dot:'#EC4899',lbl:'RS',cls:'rose'},
  '*':{bg:'rgba(26,124,62,.1)',bd:'rgba(26,124,62,.3)',tx:'#1A7C3E',dot:'#1A7C3E',lbl:'',cls:'libre'},
};
function gc(c) {
  if (!c||c==='*') return CMAP['*'];
  return CMAP[c.toLowerCase()]||{bg:'rgba(100,100,100,.1)',bd:'#ccc',tx:'#555',dot:'#888',lbl:c.slice(0,2).toUpperCase(),cls:''};
}
function pill(label) {
  if(!label||label.trim()==='')return '<span style="color:var(--text4);font-size:11px">—</span>';
  const m=gc(label);
  return `<span class="color-pill" style="background:${m.bg};border-color:${m.bd};color:${m.tx}"><span class="color-dot" style="background:${m.dot}"></span>${label}</span>`;
}
function colorSel(field, pref, fid, cur) {
  const empty = !cur || cur.trim()==='';
  const placeholderOpt = empty ? '<option value="" selected disabled>— Choisir —</option>' : '';
  return `<select class="color-sel" onchange="upd('${pref}','${fid}','${field}',this.value)">${placeholderOpt}${['Rouge','Vert','Bleu','Jaune','Violet','Blanc','Orange','Noir','Turquoise','Rose'].map(c=>`<option${c===cur?' selected':''}>${c}</option>`).join('')}</select>`;
}
function splitLine(line, sep) {
  const res=[]; let cur='',q=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){q=!q;}else if(ch===sep&&!q){res.push(cur.trim());cur='';}else{cur+=ch;}}
  res.push(cur.trim());
  return res.map(v=>v.replace(/^"|"$/g,'').trim());
}
function esc(v){return(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;');}

// ══════════════════════════════════════════════
// PM MODULE
// ══════════════════════════════════════════════
function dropPMFile(e){e.preventDefault();e.currentTarget.classList.remove('drag');const f=e.dataTransfer.files[0];if(f)loadPMFile(f);}

function clearPM(){
  if(!confirm('Supprimer le PM chargé ?'))return;
  pmData=null;
  pmPhotos=[];
  document.getElementById('pm-result').style.display='none';
  document.getElementById('pm-empty').style.display='block';
  const fi=document.getElementById('pm-file');
  if(fi)fi.value='';
  // Clear UI
  const fname=document.getElementById('pm-fname');if(fname)fname.textContent='';
  const stats=document.getElementById('pm-stats');if(stats)stats.innerHTML='';
  const legend=document.getElementById('pm-legend');if(legend)legend.innerHTML='';
  const body=document.getElementById('pm-body');if(body)body.innerHTML='';
  const pgrid=document.getElementById('pm-pgrid');if(pgrid)pgrid.innerHTML='<div class="photo-empty">Aucune photo</div>';
}

// ══════════════════════════════════════════════
// COMMANDES MODULE (A5 file)
// ══════════════════════════════════════════════
let cmdData = null;
let cmdAnalysis = null;
const COLOR_TO_OP = { 'rouge':'FREE', 'orange':'ORANGE', 'vert':'BOUYGUES', 'bleu':'SFR' };
const OP_TO_COLOR = { 'FREE':'Rouge', 'ORANGE':'Orange', 'BOUYGUES':'Vert', 'SFR':'Bleu' };
const OP_COLORS = {
  'FREE': {bg:'#FCEBEB', bd:'#E24B4A', tx:'#A32D2D', label:'FREE · ROUGE'},
  'ORANGE': {bg:'#FAEEDA', bd:'#EF9F27', tx:'#854F0B', label:'ORANGE'},
  'BOUYGUES': {bg:'#EAF3DE', bd:'#97C459', tx:'#3B6D11', label:'BOUYGUES · VERT'},
  'SFR': {bg:'#E6F1FB', bd:'#378ADD', tx:'#185FA5', label:'SFR · BLEU'}
};

function dropCmdFile(e){e.preventDefault();const f=e.dataTransfer.files[0];if(f)loadCmdFile(f);}

function loadCmdFile(file){
  if(!file)return;
  if(!pmData){alert('Veuillez d\'abord charger le fichier PM.');return;}
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const wb=XLSX.read(e.target.result,{type:'binary'});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws,{header:1});
      if(!rows.length)throw new Error('Fichier vide');
      const hdr=rows[0].map(h=>String(h||'').toLowerCase().trim());
      // Find columns: Code (operator), NomModulePm, PositionModulePm, ReferencePBO
      const ci={
        code: hdr.findIndex(h=>h==='code'),
        nomModule: hdr.findIndex(h=>h.includes('nommodulepm')||h.includes('nom module')),
        position: hdr.findIndex(h=>h.includes('positionmodulepm')||h.includes('position module')),
        pbo: hdr.findIndex(h=>h.includes('referencepbo'))
      };
      if(ci.code<0){alert('Colonne "Code" introuvable dans le fichier A5.');return;}
      const commandes=[];
      for(let i=1;i<rows.length;i++){
        const r=rows[i];if(!r||!r[ci.code])continue;
        const op=String(r[ci.code]||'').toUpperCase().trim();
        if(!OP_COLORS[op])continue;
        commandes.push({
          op:op,
          module:String(r[ci.nomModule]||'').trim(),
          position:String(r[ci.position]||'').trim(),
          pbo:String(r[ci.pbo]||'').trim()
        });
      }
      cmdData={fileName:file.name,commandes:commandes};
      analyseCommandes();
    }catch(err){alert('Erreur lecture A5: '+err.message);}
  };
  reader.readAsBinaryString(file);
}

function analyseCommandes(){
  if(!cmdData||!pmData)return;
  // Count terrain by color
  const terrain={'FREE':[],'ORANGE':[],'BOUYGUES':[],'SFR':[]};
  Object.keys(pmData).forEach(t=>{
    Object.keys(pmData[t]).forEach(pos=>{
      const c=(pmData[t][pos].couleur||'').toLowerCase();
      const op=COLOR_TO_OP[c];
      if(op)terrain[op].push({tiroir:t,position:pos,couleur:c,ssn:pmData[t][pos].ssn});
    });
  });
  // Count commandes by op
  const cmdByOp={'FREE':[],'ORANGE':[],'BOUYGUES':[],'SFR':[]};
  cmdData.commandes.forEach(cmd=>{if(cmdByOp[cmd.op])cmdByOp[cmd.op].push(cmd);});
  // Compute analysis
  cmdAnalysis={};
  // Save commandes data to mission
  if(selectedMissionId){
    sb.from('missions').update({cmd_data:cmdData,cmd_filename:cmdData.fileName}).eq('id',selectedMissionId).then(r=>{
      if(r.error)console.error('Save cmd_data error:',r.error);
    });
  }
  Object.keys(terrain).forEach(op=>{
    const tCount=terrain[op].length, cCount=cmdByOp[op].length;
    const diff=tCount-cCount;
    // Filter: only positions with SSN = "Pas de N°" are potential phantom jarretieres
    const positionsPasDeNo=terrain[op].filter(p=>{
      const s=(p.ssn||'').toLowerCase().trim();
      return s.includes('pas de n')||s.includes('non traite')||s==='';
    });
    cmdAnalysis[op]={
      terrain:tCount,
      commandes:cCount,
      diff:diff,
      surplus:diff>0,
      positions:terrain[op],
      positionsPasDeNo:positionsPasDeNo,
      color:OP_TO_COLOR[op]
    };
  });
  renderCmdResult();
}

function renderCmdResult(){
  document.getElementById('cmd-empty').style.display='none';
  document.getElementById('cmd-result').style.display='block';
  document.getElementById('cmd-fname').textContent=cmdData.fileName+' — '+cmdData.commandes.length+' commandes';
  // Render comparatif cards
  let cmpHtml='';
  Object.keys(OP_COLORS).forEach(op=>{
    const a=cmdAnalysis[op],col=OP_COLORS[op];
    const surplus=a.surplus;
    cmpHtml += '<div style="background:#fff;border:1px solid var(--gray3);border-left:3px solid '+col.bd+';border-radius:0;padding:10px">'+
      '<div style="font-size:10px;color:'+col.tx+';font-weight:700;letter-spacing:.5px">'+col.label+'</div>'+
      '<div style="display:flex;align-items:baseline;gap:4px;margin-top:4px"><span style="font-size:18px;font-weight:700">'+a.terrain+'</span><span style="font-size:11px;color:var(--text4)">/ '+a.commandes+' cmd</span></div>'+
      '<div style="font-size:11px;color:'+(surplus?'var(--red)':'var(--green)')+';margin-top:2px;font-weight:700">'+(surplus?'⚠ +'+a.diff+' surplus':(a.diff===0?'✓ Égal':'✓ '+a.diff+' OK'))+'</div>'+
    '</div>';
  });
  document.getElementById('cmd-comparatif').innerHTML=cmpHtml;
  // Total surplus alert
  const totalSurplus=Object.values(cmdAnalysis).filter(a=>a.surplus).reduce((s,a)=>s+a.diff,0);
  const opsSurplus=Object.values(cmdAnalysis).filter(a=>a.surplus).length;
  const alertEl=document.getElementById('cmd-alert');
  if(totalSurplus>0){
    alertEl.style.display='block';
    alertEl.innerHTML='⚠️ '+totalSurplus+' jarretière'+(totalSurplus>1?'s':'')+' en surplus à investiguer ('+opsSurplus+' opérateur'+(opsSurplus>1?'s':'')+' concerné'+(opsSurplus>1?'s':'')+')';
  }else{
    alertEl.style.display='block';
    alertEl.style.background='var(--green-lt)';
    alertEl.style.borderColor='rgba(26,124,62,.3)';
    alertEl.style.color='var(--green)';
    alertEl.innerHTML='✅ Aucun écart détecté — terrain conforme aux commandes';
  }
  // Per-op details cards (only those with surplus)
  let detailsHtml='';
  Object.keys(OP_COLORS).forEach(op=>{
    const a=cmdAnalysis[op];
    if(!a.surplus)return;
    const col=OP_COLORS[op];
    // Use filtered positions (only those with "Pas de N°" / empty SSN)
    const positions=a.positionsPasDeNo.slice().sort((x,y)=>{
      if(x.tiroir!==y.tiroir)return parseInt(x.tiroir)-parseInt(y.tiroir);
      return x.position.localeCompare(y.position);
    });
    if(positions.length===0){
      detailsHtml+='<div style="background:#fff;border:1px solid var(--gray3);border-radius:8px;padding:12px 14px;margin-bottom:10px">'+
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'+
          '<span style="font-size:12px;font-weight:700">'+op+' — Aucune position sans n°</span>'+
          '<span style="font-size:10px;padding:2px 8px;background:'+col.bg+';color:'+col.tx+';border-radius:4px;font-family:var(--mono)">+'+a.diff+' surplus</span>'+
        '</div>'+
        '<div style="font-size:11px;color:var(--text4);font-style:italic">Toutes les positions de cet opérateur ont un SSN identifié — investigation manuelle requise</div>'+
      '</div>';
      return;
    }
    let posHtml=positions.map(p=>'<div title="SSN: '+(p.ssn||'—')+'" style="background:'+col.bg+';color:'+col.tx+';padding:5px 7px;border-radius:3px;text-align:center;font-family:var(--mono);font-size:10px;font-weight:600">T'+p.tiroir+'·'+p.position+'</div>').join('');
    detailsHtml+='<div style="background:#fff;border:1px solid var(--gray3);border-radius:8px;padding:12px 14px;margin-bottom:10px">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
        '<span style="font-size:12px;font-weight:700">'+op+' — '+positions.length+' position'+(positions.length>1?'s':'')+' sans n° à investiguer</span>'+
        '<span style="font-size:10px;padding:2px 8px;background:'+col.bg+';color:'+col.tx+';border-radius:4px;font-family:var(--mono)">+'+a.diff+' surplus</span>'+
      '</div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:5px">'+posHtml+'</div>'+
      '<div style="font-size:10px;color:var(--text4);margin-top:8px;font-style:italic">⚠️ Box potentiellement éteintes — à vérifier sur le terrain</div>'+
    '</div>';
  });
  document.getElementById('cmd-details').innerHTML=detailsHtml;
  // Actions
  document.getElementById('cmd-actions').style.display=totalSurplus>0?'flex':'none';
}

function clearCmd(){
  if(!confirm('Supprimer l\'analyse des commandes ?'))return;
  cmdData=null; cmdAnalysis=null;
  document.getElementById('cmd-empty').style.display='block';
  document.getElementById('cmd-result').style.display='none';
  const fi=document.getElementById('cmd-file');if(fi)fi.value='';
}

function exportAllHSCSV(){
  if(!hsFibres)hsFibres={};
  const refPM=missions.find(x=>x.id===selectedMissionId)?.ref_pm||'PM';
  let csv='Tiroir;Position;Couleur Fibre PM;Tube PM;Couleur Fibre PBO;Tube PBO;Reference PBO;ID ROP;PTO;Module PM;Statut;Motif;Commentaire;Date audit\n';
  Object.entries(hsFibres).sort(([ka],[kb])=>{
    const[ta,pa]=ka.split('_'),[tb,pb]=kb.split('_');
    if(ta!==tb)return parseInt(ta)-parseInt(tb);
    return pa.localeCompare(pb);
  }).forEach(([key,f])=>{
    const posInfo=pmData?.[f.tiroir]?.[f.position]||{};
    const note=(f.note||'').replace(/;/g,',').replace(/\n/g,' ').replace(/"/g,'""');
    csv+='"'+f.tiroir+'";"'+f.position+'";"'+(f.couleur||'')+'";"'+(posInfo.tube||'')+'";"'+(posInfo.couleur_pbo||'')+'";"'+(posInfo.tube_pbo||'')+'";"'+(posInfo.ref_pbo||'')+'";"'+(posInfo.id_rop||'')+'";"'+(f.ssn||'')+'";"'+(posInfo.module_pm||'')+'";"'+(f.fibre_HS==='Oui'?'HS':'OK')+'";"'+(f.motif||'')+'";"'+note+'";"'+(f.date?new Date(f.date).toLocaleString('fr-FR'):'')+'"\n';
  });
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='audit_HS_'+refPM.replace(/[^a-z0-9]/gi,'_')+'_GLOBAL_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

function exportTiroirHSCSV(tNum){
  const fibresTiroir=hsFibres?Object.entries(hsFibres).filter(([k,v])=>k.startsWith(tNum+'_')):[];
  const refPM=missions.find(x=>x.id===selectedMissionId)?.ref_pm||'PM';
  let csv='Tiroir;Position;Couleur Fibre PM;Tube PM;Couleur Fibre PBO;Tube PBO;Reference PBO;ID ROP;PTO;Module PM;Statut;Motif;Commentaire;Date audit\n';
  fibresTiroir.sort(([ka],[kb])=>{
    const pa=ka.split('_')[1],pb=kb.split('_')[1];
    return pa.localeCompare(pb);
  }).forEach(([key,f])=>{
    const posInfo=pmData?.[f.tiroir]?.[f.position]||{};
    const note=(f.note||'').replace(/;/g,',').replace(/\n/g,' ').replace(/"/g,'""');
    csv+='"'+f.tiroir+'";"'+f.position+'";"'+(f.couleur||'')+'";"'+(posInfo.tube||'')+'";"'+(posInfo.couleur_pbo||'')+'";"'+(posInfo.tube_pbo||'')+'";"'+(posInfo.ref_pbo||'')+'";"'+(posInfo.id_rop||'')+'";"'+(f.ssn||'')+'";"'+(posInfo.module_pm||'')+'";"'+(f.fibre_HS==='Oui'?'HS':'OK')+'";"'+(f.motif||'')+'";"'+note+'";"'+(f.date?new Date(f.date).toLocaleString('fr-FR'):'')+'"\n';
  });
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='audit_HS_'+refPM.replace(/[^a-z0-9]/gi,'_')+'_tiroir_'+tNum+'_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

function exportCmdCSV(){
  if(!cmdAnalysis)return;
  let csv='Operateur;Couleur;Tiroir;Position;SSN;Statut\n';
  Object.keys(cmdAnalysis).forEach(op=>{
    const a=cmdAnalysis[op];
    if(!a.surplus)return;
    a.positionsPasDeNo.forEach(p=>{
      csv+='"'+op+'";"'+a.color+'";"'+p.tiroir+'";"'+p.position+'";"'+(p.ssn||'')+'";"Surplus sans n°"\n';
    });
  });
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='analyse_surplus_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

function exportCmdPDF(){
  if(!cmdAnalysis)return;
  const dateR=new Date().toLocaleString('fr-FR');
  const totalSurplus=Object.values(cmdAnalysis).filter(a=>a.surplus).reduce((s,a)=>s+a.diff,0);
  const currentMission=selectedMissionId?missions.find(x=>x.id===selectedMissionId):null;
  const refPM=currentMission?.ref_pm||document.getElementById('pm-fname').textContent.replace(/\.\w+$/,'')||'PM';
  let cards='';
  Object.keys(OP_COLORS).forEach(op=>{
    const a=cmdAnalysis[op],col=OP_COLORS[op];
    cards+='<div style="background:#fff;border:1px solid #e2e8f0;border-left:4px solid '+col.bd+';padding:12px;border-radius:6px">'+
      '<div style="font-size:11px;color:'+col.tx+';font-weight:700;letter-spacing:.5px">'+col.label+'</div>'+
      '<div style="display:flex;align-items:baseline;gap:6px;margin-top:6px"><span style="font-size:24px;font-weight:900">'+a.terrain+'</span><span style="font-size:11px;color:#94a3b8">/ '+a.commandes+' cmd</span></div>'+
      '<div style="font-size:12px;color:'+(a.surplus?'#dc2626':'#15803d')+';margin-top:4px;font-weight:700">'+(a.surplus?'⚠ +'+a.diff+' surplus':(a.diff===0?'✓ Égal':'✓ '+a.diff+' OK'))+'</div>'+
    '</div>';
  });
  let opDetails='';
  Object.keys(OP_COLORS).forEach(op=>{
    const a=cmdAnalysis[op];
    if(!a.surplus)return;
    const col=OP_COLORS[op];
    const positions=a.positionsPasDeNo.slice().sort((x,y)=>{
      if(x.tiroir!==y.tiroir)return parseInt(x.tiroir)-parseInt(y.tiroir);
      return x.position.localeCompare(y.position);
    });
    if(positions.length===0){
      opDetails+='<div style="margin-bottom:18px;page-break-inside:avoid">'+
        '<div style="background:'+col.bg+';padding:10px 14px;border-radius:6px;border:1px solid '+col.bd+'">'+
          '<div style="font-size:13px;font-weight:800;color:'+col.tx+'">'+op+' — Aucune position sans n°</div>'+
          '<div style="font-size:11px;color:#64748b;margin-top:4px;font-style:italic">+'+a.diff+' surplus avec SSN identifié — investigation manuelle requise</div>'+
        '</div>'+
      '</div>';
      return;
    }
    const rows=positions.map((p,i)=>'<tr style="background:'+(i%2===0?'#fff':'#f8fafc')+'"><td style="padding:6px 10px;font-family:monospace;font-size:11px;text-align:center;font-weight:700">T'+p.tiroir+'</td><td style="padding:6px 10px;font-family:monospace;font-size:11px;text-align:center;font-weight:700;color:'+col.tx+'">'+p.position+'</td><td style="padding:6px 10px;font-size:10px;color:#64748b">'+(p.ssn||'—')+'</td><td style="padding:6px 10px;text-align:center"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+col.bd+';margin-right:4px"></span><span style="font-size:11px">'+a.color+'</span></td></tr>').join('');
    opDetails+='<div style="margin-bottom:18px;page-break-inside:avoid">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;background:'+col.bg+';padding:10px 14px;border-radius:6px 6px 0 0;border:1px solid '+col.bd+';border-bottom:none">'+
        '<div style="font-size:13px;font-weight:800;color:'+col.tx+'">'+op+' — '+positions.length+' position'+(positions.length>1?'s':'')+' sans n° à investiguer</div>'+
        '<div style="font-size:11px;font-weight:700;padding:3px 10px;background:#fff;color:'+col.tx+';border-radius:4px;border:1px solid '+col.bd+'">+'+a.diff+' surplus total</div>'+
      '</div>'+
      '<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;border:1px solid '+col.bd+'"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:7px 10px;text-align:center;font-size:11px">Tiroir</th><th style="padding:7px 10px;text-align:center;font-size:11px">Position</th><th style="padding:7px 10px;text-align:left;font-size:11px">SSN</th><th style="padding:7px 10px;text-align:center;font-size:11px">Couleur</th></tr></thead><tbody>'+rows+'</tbody></table>'+
    '</div>';
  });
  const html='<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Rapport surplus · '+refPM+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff;color:#0f172a;font-size:12px;padding:18px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:0}@page{margin:12mm;size:A4}}</style></head><body>'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:12px;border-bottom:3px solid #0f172a">'+
      '<div><div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#003087;margin-bottom:4px">Rapport surplus jarretières</div><div style="font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-.5px">'+refPM+'</div><div style="font-size:11px;color:#64748b;margin-top:3px">Analyse comparative terrain vs commandes opérateurs</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Généré le '+dateR+'</div></div>'+
      '<div style="background:#E2001A;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:4px">SFR</div>'+
    '</div>'+
    '<div style="background:'+(totalSurplus>0?'#fef3c7':'#dcfce7')+';border:1px solid '+(totalSurplus>0?'#fde047':'#86efac')+';border-radius:8px;padding:12px 16px;margin-bottom:16px"><div style="font-size:13px;font-weight:700;color:'+(totalSurplus>0?'#854d0e':'#15803d')+'">'+(totalSurplus>0?'⚠️ '+totalSurplus+' jarretière'+(totalSurplus>1?'s':'')+' en surplus détectée'+(totalSurplus>1?'s':''):'✅ Aucun écart détecté')+'</div></div>'+
    '<div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Comparatif par opérateur</div>'+
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px">'+cards+'</div>'+
    (opDetails?'<div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #0f172a">Détail des positions à investiguer</div>'+opDetails:'')+
    '</body></html>';
  const w=window.open('','_blank');
  if(!w){alert('Autorisez les pop-ups.');return;}
  w.document.write(html);w.document.close();
}
function loadPMFile(file) {
  if(!file)return;
  const ext=file.name.split('.').pop().toLowerCase();
  const reader=new FileReader();
  reader.onload=function(e){
    const data={};
    try{
      if(ext==='xlsx'){
        const wb=XLSX.read(e.target.result,{type:'binary'});
        const ws=wb.Sheets[wb.SheetNames[0]];
        const rows=XLSX.utils.sheet_to_json(ws,{header:1});
        const hdr=rows[0].map(h=>String(h).toLowerCase().trim());
        const ti=hdr.findIndex(h=>h.includes('tiroir')),pi=hdr.findIndex(h=>h.includes('position'));
        const ci=hdr.findIndex(h=>h.includes('couleur')),si=hdr.findIndex(h=>h.includes('ssn'));
        for(let i=1;i<rows.length;i++){const r=rows[i];if(!r||!r[ti])continue;const t=parseInt(r[ti]),pos=String(r[pi]||'').trim();let col=String(r[ci]||'').trim();if(!t||!pos)continue;if(!col||col==='*')col='*';if(!data[t])data[t]={};data[t][pos]={couleur:col,ssn:String(r[si]||'').trim()};}
      }else{
        const txt=e.target.result;const lines=txt.split(/\r?\n/);const h0=lines[0];
        const sep=(h0.split(',').length>=h0.split(';').length)?',':';';
        const hdr=splitLine(h0,sep).map(h=>h.toLowerCase());
        const ti=hdr.findIndex(h=>h.includes('tiroir')),pi=hdr.findIndex(h=>h.includes('position'));
        const ci=hdr.findIndex(h=>h.includes('couleur')),si=hdr.findIndex(h=>h.includes('ssn'));
        for(let i=1;i<lines.length;i++){const ln=lines[i].trim();if(!ln)continue;const p=splitLine(ln,sep);if(p.length<3)continue;const t=parseInt(p[ti]),pos=(p[pi]||'').trim();let col=(p[ci]||'').trim();if(!t||!pos)continue;if(!col||col==='*')col='*';if(!data[t])data[t]={};data[t][pos]={couleur:col,ssn:(p[si]||'').trim()};}
      }
    }catch(err){alert('Erreur: '+err.message);return;}
    pmData=data;renderPM(file.name);
    // Save PM data to mission if we're in a mission context
    if(selectedMissionId){
      sb.from('missions').update({pm_data:pmData,pm_filename:file.name}).eq('id',selectedMissionId).then(r=>{
        if(r.error)console.error('Save pm_data error:',r.error);
      });
    }
  };
  if(ext==='xlsx')reader.readAsBinaryString(file);else reader.readAsText(file,'Windows-1252');
}
function renderPM(fname){
  document.getElementById('pm-result').style.display='block';
  document.getElementById('pm-empty').style.display='none';
  document.getElementById('pm-fname').textContent=fname;
  let total=0,libres=0;
  Object.values(pmData).forEach(t=>Object.values(t).forEach(p=>{total++;if(p.couleur==='*')libres++;}));
  const occ=total-libres;
  if(isHSMode){
    const audites=Object.keys(hsFibres).length;
    const hsCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length;
    const okCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length;
    const pct=total>0?Math.round(audites/occ*100):0;
    document.getElementById('pm-stats').innerHTML=scCard('Tiroirs',Object.keys(pmData).length,'var(--blue)')+scCard('Positions',total)+scCard('Auditées',audites,'var(--blue)')+scCard('Fibres HS',hsCount,'var(--red)')+scCard('Fibres OK',okCount,'var(--green)')+scCard('Avancement',pct+'%','var(--blue)');
  }else{
    document.getElementById('pm-stats').innerHTML=scCard('Tiroirs',Object.keys(pmData).length,'var(--blue)')+scCard('Positions',total)+scCard('Libres',libres,'var(--green)')+scCard('Occupées',occ,'var(--red)')+scCard('Occupation',Math.round(occ/total*100)+'%');
  }
  const cols=[...new Set(Object.values(pmData).flatMap(t=>Object.values(t).map(p=>p.couleur)))].filter(c=>c!=='*');
  if(isHSMode){
    document.getElementById('pm-legend').innerHTML='';
  }else{
    let leg='<div class="leg"><div class="leg-dot" style="background:rgba(26,124,62,.5)"></div>Libre</div>';
    cols.forEach(c=>{const m=gc(c);leg+=`<div class="leg"><div class="leg-dot" style="background:${m.dot}"></div>${c}</div>`;});
    document.getElementById('pm-legend').innerHTML=leg;
  }
  const currentMission = selectedMissionId ? missions.find(x => x.id === selectedMissionId) : null;
  const titleRef = currentMission?.ref_pm || fname.replace(/\.\w+$/,'');
  document.getElementById('pm-cab-title').textContent='ARMOIRE PM · '+titleRef;
  const body=document.getElementById('pm-body');body.innerHTML='';
  Object.keys(pmData).sort((a,b)=>+a-+b).forEach(t=>body.appendChild(buildTiroir(t)));
}
function buildTiroir(tNum){
  const d=pmData[tNum];const positions=Object.keys(d).sort();
  // Filter out invalid positions (must be Letter+Number format)
  const validPositions=positions.filter(p=>/^[A-Z]\d+$/i.test(p));
  const rowKeys=[...new Set(validPositions.map(p=>p[0]))].sort();
  const maxCol=validPositions.length>0?Math.max(...validPositions.map(p=>parseInt(p.slice(1)))):0;
  const cols=Array.from({length:maxCol},(_,i)=>i+1);
  const libres=validPositions.filter(p=>d[p].couleur==='*').length;
  const total=validPositions.length;
  const occupees=total-libres;
  const pct=total>0?Math.round(occupees/total*100):0;
  console.log('Tiroir',tNum,'- Total:',total,'Libres:',libres,'Occupées:',occupees,'MaxCol:',maxCol);
  const cw=maxCol>12?18:22,ch=maxCol>12?14:18;
  const div=document.createElement('div');div.className='tiroir';
  const hdr=document.createElement('div');hdr.className='tiroir-hdr';
  const hsCountTir = isHSMode ? Object.keys(hsFibres).filter(k=>k.startsWith(tNum+'_')).length : 0;
  hdr.innerHTML=`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="t-name">TIROIR ${tNum}</span><span class="t-meta">${rowKeys.length} rg · ${maxCol} col</span></div><div style="display:flex;align-items:center;gap:8px">${isHSMode ? `<button onclick="event.stopPropagation();exportTiroirHSCSV('${tNum}')" title="Exporter rapport CSV de ce tiroir" style="font-size:10px;padding:3px 8px;background:var(--blue);color:#fff;border:none;border-radius:4px;cursor:pointer;font-family:'Syne',sans-serif;font-weight:700">⬇ CSV (${hsCountTir})</button>` : ''}${isHSMode ? `<span title="Fibres auditées" style="font-size:10px;font-family:var(--mono);background:rgba(0,48,135,.08);border:1px solid rgba(0,48,135,.2);color:var(--blue);padding:2px 7px;border-radius:4px;font-weight:700">${hsCountTir}/${occupees} fibres</span>` : `<span title="Positions libres" style="font-size:10px;font-family:var(--mono);background:rgba(26,124,62,.1);border:1px solid rgba(26,124,62,.25);color:var(--green);padding:2px 7px;border-radius:4px;font-weight:700">● ${libres} libres</span><span title="Positions occupées" style="font-size:10px;font-family:var(--mono);background:rgba(226,0,26,.08);border:1px solid rgba(226,0,26,.2);color:var(--red);padding:2px 7px;border-radius:4px;font-weight:700">● ${occupees} occup.</span>`}<span class="t-arrow" id="ta-${tNum}">▼</span></div>`;
  hdr.onclick=()=>{const b=document.getElementById('tb-'+tNum),a=document.getElementById('ta-'+tNum);const o=b.classList.toggle('open');a.classList.toggle('open',o);};
  div.appendChild(hdr);
  const body=document.createElement('div');body.className='tiroir-body';body.id='tb-'+tNum;
  const pb=document.createElement('div');pb.className='prog-bar';pb.innerHTML=`<div class="prog-fill" style="width:${pct}%"></div>`;body.appendChild(pb);
  const scroll=document.createElement('div');scroll.className='grid-scroll';
  let gh='<div style="display:inline-block"><div class="grid-col-hdr"><div style="width:20px"></div>';
  cols.forEach(c=>{gh+=`<div class="ch" style="width:${cw}px">${String(c).padStart(2,'0')}</div>`;});gh+='</div>';
  rowKeys.forEach(row=>{
    gh+=`<div class="g-row"><div class="rl">${row}</div>`;
    cols.forEach(c=>{const pos=row+String(c).padStart(2,'0');const info=d[pos];
      if(info){const m=gc(info.couleur);
        const isHS=info.couleur!=='*'&&hsFibres[tNum+'_'+pos]?.fibre_HS==='Oui';
        const isOK=info.couleur!=='*'&&hsFibres[tNum+'_'+pos]?.fibre_HS==='Non';
        const isSel=hsSelected.has(tNum+'_'+pos);
        const stateCls=isHS?' hs':isOK?' ok-audit':'';
        const selCls=isSel?' hs-selected':'';
        const clickable=info.couleur!=='*'&&isHSMode?' hs-selectable':'';
        gh+=`<div class="cell ${m.cls}${stateCls}${selCls}${clickable}" style="width:${cw}px;height:${ch}px" data-t="${tNum}" data-pos="${pos}" data-c="${info.couleur}" data-ssn="${esc(info.ssn)}">${m.lbl}</div>`;}
      else{gh+=`<div class="cell-empty" style="width:${cw}px;height:${ch}px;flex-shrink:0"></div>`;}
    });gh+='</div>';
  });
  gh+='</div>';scroll.innerHTML=gh;body.appendChild(scroll);div.appendChild(body);return div;
}
function pmAll(open){if(!pmData)return;Object.keys(pmData).forEach(t=>{document.getElementById('tb-'+t)?.classList.toggle('open',open);document.getElementById('ta-'+t)?.classList.toggle('open',open);});}

// HS Audit Modal
function openHSModal(tNum,pos,couleur,ssn){
  const key=tNum+'_'+pos;
  const existing=hsFibres[key]||{};
  const posInfo=pmData?.[tNum]?.[pos]||{};
  const isHS=existing.fibre_HS==='Oui';
  const motif=existing.motif||'';
  const note=existing.note||'';
  const colorMap={rouge:'#E24B4A',orange:'#EF9F27',vert:'#97C459',bleu:'#378ADD',jaune:'#EF9F27',violet:'#7F77DD',blanc:'#B4B2A9',noir:'#374151',turquoise:'#06b6d4',rose:'#ec4899'};
  const dotColor=colorMap[(couleur||'').toLowerCase()]||'#888';
  const html=`<div id="hs-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)closeHSModal()">
    <div style="background:#fff;border-radius:12px;max-width:480px;width:100%;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3)">
      <div style="padding:16px 20px;border-bottom:1px solid var(--gray3);display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="display:inline-block;width:16px;height:16px;background:${dotColor};border-radius:3px"></span>
          <span style="font-family:var(--mono);font-size:14px;font-weight:700">Position ${pos} — Tiroir ${tNum}</span>
        </div>
        <button onclick="closeHSModal()" style="background:transparent;border:none;cursor:pointer;color:var(--text4);font-size:18px">✕</button>
      </div>
      <div style="padding:16px 20px">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;font-size:11px">
          <div><span style="color:var(--text4)">Fibre PM</span> · <strong>${couleur||'—'}</strong></div>
          <div><span style="color:var(--text4)">Tube PM</span> · <strong>${posInfo.tube||'—'}</strong></div>
          <div><span style="color:var(--text4)">Couleur PBO</span> · <strong>${posInfo.couleur_pbo||'—'}</strong></div>
          <div><span style="color:var(--text4)">Tube PBO</span> · <strong>${posInfo.tube_pbo||'—'}</strong></div>
          <div style="grid-column:span 2"><span style="color:var(--text4)">Réf PBO</span> · <span style="font-family:var(--mono);font-size:10px">${posInfo.ref_pbo||'—'}</span></div>
          ${posInfo.id_pbo?`<div style="grid-column:span 2"><span style="color:var(--text4)">ID PBO</span> · <span style="font-family:var(--mono);font-size:10px">${posInfo.id_pbo}</span></div>`:''}
          <div><span style="color:var(--text4)">ID ROP</span> · <span style="font-family:var(--mono);font-size:10px">${posInfo.id_rop||'—'}</span></div>
          <div><span style="color:var(--text4)">PTO</span> · <span style="font-family:var(--mono);font-size:10px">${ssn||'—'}</span></div>
        </div>
        <div style="margin-bottom:14px">
          <p style="font-size:11px;color:var(--text4);margin:0 0 8px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">Statut de la fibre</p>
          <div style="display:flex;gap:8px">
            <button id="hs-btn-ok" onclick="setHSStatus('${tNum}','${pos}','Non')" style="flex:1;background:${!isHS&&existing.fibre_HS==='Non'?'#1A7C3E':'#fff'};border:1px solid #1A7C3E;color:${!isHS&&existing.fibre_HS==='Non'?'#fff':'#0F6E56'};padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">✓ Fibre OK</button>
            <button id="hs-btn-hs" onclick="setHSStatus('${tNum}','${pos}','Oui')" style="flex:1;background:${isHS?'#A32D2D':'#fff'};border:1px solid #A32D2D;color:${isHS?'#fff':'#A32D2D'};padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">⚠ Fibre HS</button>
          </div>
        </div>
        <div id="hs-motif-section" style="display:${isHS?'block':'none'}">
          <p style="font-size:11px;color:var(--text4);margin:0 0 8px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">Motif HS</p>
          <select id="hs-motif" style="width:100%;padding:8px 12px;border:1px solid var(--gray3);border-radius:8px;font-size:12px;background:#fff;margin-bottom:8px">
            <option value="">— Choisir un motif —</option>
            ${HS_MOTIFS.map(m=>'<option'+(motif===m?' selected':'')+'>'+m+'</option>').join('')}
          </select>
          <textarea id="hs-note" placeholder="Note complémentaire (optionnel)" style="width:100%;padding:8px 12px;border:1px solid var(--gray3);border-radius:8px;font-size:12px;min-height:60px;resize:vertical;font-family:inherit">${note}</textarea>
        </div>
        <button onclick="saveHSFibre('${tNum}','${pos}','${couleur}','${ssn}')" style="width:100%;margin-top:14px;padding:10px;background:var(--blue);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">💾 Enregistrer</button>
      </div>
    </div>
  </div>`;
  document.querySelectorAll('#hs-modal-overlay').forEach(el=>el.remove());
  document.body.insertAdjacentHTML('beforeend',html);
}

function closeHSModal(){
  const ov=document.getElementById('hs-modal-overlay');
  if(ov)ov.remove();
}

function setHSStatus(tNum,pos,status){
  // Visual update of buttons in modal
  const btnOK=document.getElementById('hs-btn-ok');
  const btnHS=document.getElementById('hs-btn-hs');
  const motifSec=document.getElementById('hs-motif-section');
  if(status==='Oui'){
    btnOK.style.background='#fff';btnOK.style.color='#0F6E56';
    btnHS.style.background='#A32D2D';btnHS.style.color='#fff';
    motifSec.style.display='block';
  }else{
    btnOK.style.background='#1A7C3E';btnOK.style.color='#fff';
    btnHS.style.background='#fff';btnHS.style.color='#A32D2D';
    motifSec.style.display='none';
  }
  // Store temporary status
  if(!hsFibres[tNum+'_'+pos])hsFibres[tNum+'_'+pos]={};
  hsFibres[tNum+'_'+pos].fibre_HS=status;
}

async function saveHSFibre(tNum,pos,couleur,ssn){
  const key=tNum+'_'+pos;
  const status=hsFibres[key]?.fibre_HS||'Non';
  const motif=document.getElementById('hs-motif')?.value||'';
  const note=document.getElementById('hs-note')?.value||'';
  if(status==='Oui'&&!motif){alert('Veuillez sélectionner un motif HS.');return;}
  hsFibres[key]={fibre_HS:status,motif:motif,note:note,tiroir:tNum,position:pos,couleur:couleur,ssn:ssn,date:new Date().toISOString()};
  // Save to mission (background, non-blocking for UX)
  if(selectedMissionId){
    sb.from('missions').update({hs_fibres:hsFibres}).eq('id',selectedMissionId).then(r=>{
      if(r.error)console.error('Save HS error:',r.error);
    });
  }
  // Update only the specific cell (keep all tiroirs as-is)
  const cell=document.querySelector(`.cell[data-t="${tNum}"][data-pos="${pos}"]`);
  if(cell){
    cell.classList.remove('hs','ok-audit');
    if(status==='Oui')cell.classList.add('hs');
    else cell.classList.add('ok-audit');
  }
  // Confirm visually inside modal then close
  const btn=document.querySelector('#hs-modal-overlay button[onclick^="saveHSFibre"]');
  if(btn){
    const orig=btn.innerHTML;
    btn.innerHTML='✓ Enregistré';
    btn.style.background='var(--green)';
    setTimeout(()=>{closeHSModal();},500);
  }
  // Refresh stats only (no full grid rebuild)
  updateHSStatsOnly();
}

function updateHSStatsOnly(){
  const btnGlobal=document.getElementById('btn-csv-all-hs');
  if(btnGlobal){
    btnGlobal.style.display=isHSMode?'':'none';
    btnGlobal.innerHTML='⬇ Export CSV global ('+Object.keys(hsFibres||{}).length+')';
  }
  if(!pmData)return;
  let total=0,libres=0;
  Object.values(pmData).forEach(t=>Object.values(t).forEach(p=>{total++;if(p.couleur==='*')libres++;}));
  const occ=total-libres;
  if(isHSMode){
    const audites=Object.keys(hsFibres).length;
    const hsCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length;
    const okCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length;
    const pct=occ>0?Math.round(audites/occ*100):0;
    document.getElementById('pm-stats').innerHTML=scCard('Tiroirs',Object.keys(pmData).length,'var(--blue)')+scCard('Positions',total)+scCard('Auditées',audites,'var(--blue)')+scCard('Fibres HS',hsCount,'var(--red)')+scCard('Fibres OK',okCount,'var(--green)')+scCard('Avancement',pct+'%','var(--blue)');
    // Refresh per-tiroir badges (audited count) and CSV button counts
    Object.keys(pmData).forEach(t=>{
      const d=pmData[t];
      const validPositions=Object.keys(d).filter(p=>/^[A-Z]\d+$/i.test(p));
      const occT=validPositions.filter(p=>d[p].couleur!=='*').length;
      const auditedT=Object.keys(hsFibres).filter(k=>k.startsWith(t+'_')).length;
      // Update CSV button label
      const csvBtns=document.querySelectorAll('button[onclick*="exportTiroirHSCSV(\''+t+'\')"]');
      csvBtns.forEach(b=>b.innerHTML='⬇ CSV ('+auditedT+')');
      // Update fibres badge text
      const tirHdr=document.getElementById('ta-'+t)?.parentElement?.parentElement;
      if(tirHdr){
        const badge=tirHdr.querySelector('span[title="Fibres auditées"]');
        if(badge)badge.textContent=auditedT+'/'+occT+' fibres';
      }
    });
  }
  updateHSStats();
}

// Batch mode bar
let batchBarExpanded=false;
function updateBatchBar(){
  let bar=document.getElementById('hs-batch-bar');
  if(hsSelected.size===0){if(bar)bar.remove();batchBarExpanded=false;return;}
  if(!bar){
    bar=document.createElement('div');
    bar.id='hs-batch-bar';
    document.body.appendChild(bar);
    batchBarExpanded=false;
  }
  if(batchBarExpanded){
    // Expanded: full panel
    bar.onclick=null;
    bar.style.cssText='position:fixed;bottom:20px;right:20px;background:#fff;border:1px solid var(--gray3);border-radius:12px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.15);z-index:9000;display:flex;flex-direction:column;gap:10px;max-width:340px;width:calc(100% - 40px)';
    const positions=[...hsSelected].map(k=>{const[t,p]=k.split('_');return 'T'+t+'·'+p;}).slice(0,8).join(', ')+(hsSelected.size>8?'...':'');
    bar.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div style="font-size:13px;font-weight:700;color:var(--blue)">📋 ${hsSelected.size} fibre${hsSelected.size>1?'s':''} sélectionnée${hsSelected.size>1?'s':''}</div><button onclick="batchBarExpanded=false;updateBatchBar()" style="padding:4px 9px;background:#fff;border:1px solid var(--gray3);border-radius:5px;font-size:11px;cursor:pointer;font-weight:600">Réduire ▼</button></div>
    <div style="font-size:10px;color:var(--text4);font-family:var(--mono);max-height:50px;overflow-y:auto">${positions}</div>
    <div style="display:flex;gap:6px"><button onclick="clearHSSelection()" style="flex:1;padding:10px;background:#fff;border:1px solid var(--gray3);border-radius:6px;font-size:12px;cursor:pointer;font-weight:600">Annuler</button>
    <button onclick="applyBatchOK()" style="flex:2;padding:10px;background:#1A7C3E;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">✓ Marquer ${hsSelected.size} OK</button></div>
    <div style="height:1px;background:var(--gray3);margin:4px 0"></div>
    <div style="font-size:11px;color:var(--text4);text-transform:uppercase;letter-spacing:.5px;font-weight:600">OU MARQUER HS</div>
    <select id="batch-motif" style="padding:9px 10px;border:1px solid var(--gray3);border-radius:6px;font-size:13px;background:#fff;width:100%"><option value="">— Motif commun —</option>${HS_MOTIFS.map(m=>'<option>'+m+'</option>').join('')}</select>
    <textarea id="batch-note" placeholder="Commentaire commun (optionnel)" style="padding:9px 10px;border:1px solid var(--gray3);border-radius:6px;font-size:13px;background:#fff;width:100%;min-height:50px;resize:vertical;font-family:inherit"></textarea>
    <button onclick="applyBatchHS()" style="padding:10px;background:#A32D2D;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">⚠ Marquer ${hsSelected.size} HS →</button>`;
  }else{
    // Collapsed: small floating dock
    bar.style.cssText='position:fixed;bottom:20px;right:20px;background:#A32D2D;color:#fff;border-radius:50px;padding:10px 16px;box-shadow:0 4px 16px rgba(163,45,45,.4);z-index:9000;display:flex;align-items:center;gap:10px;cursor:pointer;font-family:Syne,sans-serif;font-weight:700;font-size:13px';
    bar.onclick=()=>{batchBarExpanded=true;updateBatchBar();};
    bar.innerHTML=`<span style="font-size:14px">⚠</span><span>${hsSelected.size} sélectionnée${hsSelected.size>1?'s':''}</span><span style="background:rgba(255,255,255,.25);border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px">▲</span>`;
  }
}

function clearHSSelection(){
  hsSelected.clear();
  document.querySelectorAll('.cell.hs-selected').forEach(c=>c.classList.remove('hs-selected'));
  updateBatchBar();
}

async function applyBatchOK(){
  hsSelected.forEach(key=>{
    const[t,p]=key.split('_');
    const cell=document.querySelector(`.cell[data-t="${t}"][data-pos="${p}"]`);
    const couleur=cell?.dataset.c||'';
    const ssn=cell?.dataset.ssn||'';
    hsFibres[key]={fibre_HS:'Non',motif:'',note:'',tiroir:t,position:p,couleur:couleur,ssn:ssn,date:new Date().toISOString()};
    if(cell){
      cell.classList.remove('hs','hs-selected');
      cell.classList.add('ok-audit');
    }
  });
  if(selectedMissionId){
    sb.from('missions').update({hs_fibres:hsFibres}).eq('id',selectedMissionId).then(r=>{
      if(r.error)console.error('Save HS batch OK error:',r.error);
    });
  }
  hsSelected.clear();
  batchBarExpanded=false;
  updateBatchBar();
  updateHSStatsOnly();
}

async function applyBatchHS(){
  const motif=document.getElementById('batch-motif')?.value;
  const note=document.getElementById('batch-note')?.value||'';
  if(!motif){alert('Veuillez choisir un motif.');return;}
  hsSelected.forEach(key=>{
    const[t,p]=key.split('_');
    const cell=document.querySelector(`.cell[data-t="${t}"][data-pos="${p}"]`);
    const couleur=cell?.dataset.c||'';
    const ssn=cell?.dataset.ssn||'';
    hsFibres[key]={fibre_HS:'Oui',motif:motif,note:note,tiroir:t,position:p,couleur:couleur,ssn:ssn,date:new Date().toISOString()};
    // Update cell directly without rebuild
    if(cell){
      cell.classList.remove('ok-audit','hs-selected');
      cell.classList.add('hs');
    }
  });
  if(selectedMissionId){
    sb.from('missions').update({hs_fibres:hsFibres}).eq('id',selectedMissionId).then(r=>{
      if(r.error)console.error('Save HS batch error:',r.error);
    });
  }
  hsSelected.clear();
  batchBarExpanded=false;
  updateBatchBar();
  updateHSStatsOnly();
}

function toggleBatchMode(){
  batchModeOn=!batchModeOn;
  const btn=document.getElementById('btn-batch-mode');
  if(btn){
    if(batchModeOn){
      btn.style.background='#F59E0B';btn.style.color='#fff';btn.innerHTML='✓ Mode batch ON';
    }else{
      btn.style.background='#fff';btn.style.color='var(--text)';btn.innerHTML='☑ Mode batch';
      clearHSSelection();
    }
  }
}

function updateHSStats(){
  const el=document.getElementById('hs-stats-bar');
  if(!el)return;
  const hsCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length;
  const okCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length;
  const total=Object.keys(hsFibres).length;
  el.innerHTML=`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between">
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span style="font-size:11px;color:var(--text4);font-family:var(--mono)">AUDITS:</span>
      <span style="font-size:11px;padding:3px 9px;background:rgba(26,124,62,.1);color:var(--green);border:1px solid rgba(26,124,62,.25);border-radius:4px;font-family:var(--mono);font-weight:700">✓ ${okCount} OK</span>
      <span style="font-size:11px;padding:3px 9px;background:rgba(226,0,26,.08);color:var(--red);border:1px solid rgba(226,0,26,.2);border-radius:4px;font-family:var(--mono);font-weight:700">⚠ ${hsCount} HS</span>
      <span style="font-size:11px;color:var(--text4);font-family:var(--mono)">/ ${total} fibres traitées</span>
    </div>
    <button id="btn-batch-mode" onclick="toggleBatchMode()" style="font-size:12px;padding:7px 14px;background:${batchModeOn?'#F59E0B':'#fff'};color:${batchModeOn?'#fff':'var(--text)'};border:1px solid ${batchModeOn?'#F59E0B':'var(--gray3)'};border-radius:6px;cursor:pointer;font-weight:700;font-family:'Syne',sans-serif">${batchModeOn?'✓ Mode batch ON':'☑ Mode batch'}</button>
  </div>
  <div style="font-size:10px;color:var(--text4);font-family:var(--mono);margin-top:6px;font-style:italic">${batchModeOn?'Touchez plusieurs positions pour les sélectionner':'Touchez une position pour la marquer · Activez le mode batch pour sélection multiple'}</div>`;
}

// PM Click handler for HS mode
document.addEventListener('click',e=>{
  if(!isHSMode)return;
  // Ignore clicks inside the batch bar or HS modal
  if(e.target.closest('#hs-batch-bar'))return;
  if(e.target.closest('#hs-modal-overlay'))return;
  const cell=e.target.closest('.cell');
  if(!cell)return;
  const tNum=cell.dataset.t,pos=cell.dataset.pos,couleur=cell.dataset.c;
  if(couleur==='*')return; // skip libre positions
  const key=tNum+'_'+pos;
  if(e.shiftKey || batchModeOn){
    // Batch select (Maj+clic OR mode batch activé)
    if(hsSelected.has(key))hsSelected.delete(key);else hsSelected.add(key);
    cell.classList.toggle('hs-selected');
    updateBatchBar();
  }else{
    openHSModal(tNum,pos,couleur,cell.dataset.ssn);
  }
});

// PM Tooltip
const tt=document.getElementById('tt');let ttOn=false;
document.addEventListener('mouseover',e=>{const c=e.target.closest('.cell');if(!c){if(ttOn){tt.style.display='none';ttOn=false;}return;}document.getElementById('tt-pos').textContent='T'+c.dataset.t+' · '+c.dataset.pos;document.getElementById('tt-ssn').textContent=c.dataset.ssn||'—';const b=document.getElementById('tt-badge'),m=gc(c.dataset.c);b.textContent=c.dataset.c==='*'?'Libre':c.dataset.c;b.style.cssText=`background:${m.bg};border:1px solid ${m.bd};color:${m.tx}`;tt.style.display='block';ttOn=true;});
document.addEventListener('mousemove',e=>{if(!ttOn)return;let x=e.clientX+14,y=e.clientY-8;if(x+200>window.innerWidth)x=e.clientX-205;tt.style.left=x+'px';tt.style.top=y+'px';});
document.addEventListener('mouseout',e=>{if(!e.target.closest('.cell')){tt.style.display='none';ttOn=false;}});

// PM Photos
function addPMPhotos(files){if(!files||!files.length)return;let done=0;Array.from(files).forEach(file=>{const r=new FileReader();r.onload=function(e){pmPhotos.push({name:file.name,dataUrl:e.target.result});if(++done===files.length)renderPMPhotos();};r.readAsDataURL(file);});}
function renderPMPhotos(){const grid=document.getElementById('pm-pgrid');if(!grid)return;if(!pmPhotos.length){grid.innerHTML='<div class="photo-empty">Aucune photo</div>';return;}grid.innerHTML=pmPhotos.map((ph,i)=>`<div class="photo-thumb-wrap"><img class="photo-thumb" src="${ph.dataUrl}" onclick="openPMModal(${i})" title="${ph.name}"><button class="photo-del" onclick="delPMPhoto(${i})">✕</button><div class="photo-name">${ph.name.slice(0,14)}${ph.name.length>14?'…':''}</div></div>`).join('');}
function delPMPhoto(idx){pmPhotos.splice(idx,1);renderPMPhotos();}
function openPMModal(idx){const ph=pmPhotos[idx];if(!ph)return;document.getElementById('modal-img').src=ph.dataUrl;document.getElementById('modal-name').textContent=ph.name;document.getElementById('photo-modal').classList.add('open');}
function closeModal(){document.getElementById('photo-modal').classList.remove('open');}

// PM PDF
function exportPMPDF(){
  if(!pmData){alert('Aucun PM chargé.');return;}
  const currentMission=selectedMissionId?missions.find(x=>x.id===selectedMissionId):null;
  // Auto-detect HS mode based on current mission (override global state if needed)
  const isHSReport=currentMission?.type_audit==='HS' || isHSMode;
  if(isHSReport){isHSMode=true;hsFibres=currentMission?.hs_fibres||hsFibres||{};}
  const rawName=document.getElementById('pm-fname').textContent||'PM';
  const fname=currentMission?.ref_pm||rawName.replace(/\.\w+$/,'');
  const dateR=new Date().toLocaleString('fr-FR');
  let total=0,libres=0;const cc={};
  Object.values(pmData).forEach(t=>Object.values(t).forEach(p=>{total++;if(p.couleur==='*')libres++;else cc[p.couleur]=(cc[p.couleur]||0)+1;}));
  const occ=total-libres;const tiroirs=Object.keys(pmData).sort((a,b)=>+a-+b);
  // HS stats
  const hsTotal=Object.keys(hsFibres).length;
  const hsCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Oui').length;
  const okCount=Object.values(hsFibres).filter(f=>f.fibre_HS==='Non').length;
  const hsPct=occ>0?Math.round(hsTotal/occ*100):0;
  const SOLID={rouge:'#ef4444',vert:'#22c55e',bleu:'#003087',jaune:'#f59e0b',violet:'#8b5cf6',blanc:'#9ca3af',orange:'#f97316',noir:'#374151',turquoise:'#06b6d4',rose:'#ec4899','*':'#1A7C3E'};
  function sol(c){return SOLID[(c||'*').toLowerCase()]||'#888';}
  let tirnb=tiroirs.map(tNum=>{
    const d=pmData[tNum];const positions=Object.keys(d).sort();
    const rowKeys=[...new Set(positions.map(p=>p[0]))].sort();
    const maxCol=Math.max(...positions.map(p=>parseInt(p.slice(1))));
    const cols=Array.from({length:maxCol},(_,i)=>i+1);
    const tL=positions.filter(p=>d[p].couleur==='*').length;
    const cw=maxCol>12?14:18,ch=maxCol>12?12:16;
    let hC='<td style="width:20px"></td>';cols.forEach(c=>{hC+=`<td style="width:${cw}px;text-align:center;font-size:7px;color:#94a3b8;font-weight:700;padding:1px 0">${String(c).padStart(2,'0')}</td>`;});
    let rH='';rowKeys.forEach(row=>{let cells=`<td style="font-size:8px;font-weight:700;color:#94a3b8;text-align:right;padding-right:4px;width:20px">${row}</td>`;cols.forEach(c=>{const pos=row+String(c).padStart(2,'0');const info=d[pos]||d[row+c];if(info){const bg=info.couleur==='*'?'rgba(26,124,62,.12)':sol(info.couleur)+'22';const border=sol(info.couleur);const txt=info.couleur==='*'?'':info.couleur.slice(0,2).toUpperCase();const hsK=tNum+'_'+pos;const hsK2=tNum+'_'+row+c;const hsInfo=hsFibres[hsK]||hsFibres[hsK2];const isHS=hsInfo?.fibre_HS==='Oui';const isOK=hsInfo?.fibre_HS==='Non';const outline=isHS?';outline:1.5px solid #A32D2D':isOK?';outline:1.5px solid #1A7C3E':'';const badge=isHS?`<span style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;background:#A32D2D;color:#fff;border-radius:50%;font-size:6px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fff;line-height:1">⚠</span>`:isOK?`<span style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;background:#1A7C3E;color:#fff;border-radius:50%;font-size:6px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;border:1px solid #fff;line-height:1">✓</span>`:'';cells+=`<td style="position:relative;padding:0;width:${cw}px"><div style="width:${cw}px;height:${ch}px;background:${bg};border:1px solid ${border};border-radius:2px;text-align:center;font-size:6px;font-weight:700;color:${border};padding:0;position:relative${outline}">${txt}${badge}</div></td>`;}else{cells+=`<td style="width:${cw}px"></td>`;}});rH+=`<tr>${cells}</tr>`;});
    return `<div style="break-inside:avoid;margin-bottom:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden"><div style="background:#0f172a;padding:7px 12px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:11px;font-weight:700;color:#fff;font-family:monospace">TIROIR ${tNum}</span><span style="font-size:10px;color:#94a3b8">${rowKeys.length} rg · ${maxCol} col · <span style="color:#10b981;font-weight:700">${tL} libres</span> · <span style="color:#ef4444;font-weight:700">${positions.length-tL} occupées</span></span></div><div style="padding:10px;overflow-x:auto"><table style="border-collapse:collapse;table-layout:fixed"><thead><tr>${hC}</tr></thead><tbody>${rH}</tbody></table></div></div>`;
  }).join('');
  const legH='<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px">'+
    '<div style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:rgba(26,124,62,.2);border:1px solid #1A7C3E;display:inline-block"></span><span style="font-size:10px;color:#374151">Libre</span></div>'+
    Object.keys(cc).sort().map(col=>{const clr=sol(col);return `<div style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:${clr}22;border:1px solid ${clr};display:inline-block"></span><span style="font-size:10px;color:#374151">${col} (${cc[col]})</span></div>`;}).join('')+
  '</div>';
  const photosH=pmPhotos.length>0?`<div style="margin-top:20px;page-break-before:always"><div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #0f172a">Photos de l'armoire</div><div style="display:grid;grid-template-columns:repeat(${Math.min(pmPhotos.length,3)},1fr);gap:12px">${pmPhotos.map(ph=>`<div><img src="${ph.dataUrl}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0"><div style="font-size:9px;color:#94a3b8;margin-top:4px;text-align:center">${ph.name}</div></div>`).join('')}</div></div>`:'';
  // HS details table section
  let hsTableSection='';
  if(isHSMode && hsTotal>0){
    let hsRows='';
    Object.entries(hsFibres).sort(([a],[b])=>a.localeCompare(b)).forEach(([key,f])=>{
      const posInfo=pmData?.[f.tiroir]?.[f.position]||{};
      const isHS=f.fibre_HS==='Oui';
      hsRows+=`<tr style="background:${isHS?'#FCEBEB':'#F0F9F4'}"><td style="padding:5px 7px;font-family:monospace;text-align:center;font-weight:700;font-size:9px">T${f.tiroir}</td><td style="padding:5px 7px;font-family:monospace;text-align:center;font-weight:700;font-size:9px">${f.position}</td><td style="padding:5px 7px;font-size:9px">${f.couleur||'—'}</td><td style="padding:5px 7px;font-size:8px;font-family:monospace">${posInfo.ref_pbo||'—'}</td><td style="padding:5px 7px;font-size:8px;font-family:monospace">${posInfo.id_rop||'—'}</td><td style="padding:5px 7px;font-size:8px;font-family:monospace">${f.ssn||'—'}</td><td style="padding:5px 7px;text-align:center"><span style="padding:2px 6px;border-radius:3px;font-size:8px;font-weight:700;${isHS?'background:#A32D2D;color:#fff':'background:#1A7C3E;color:#fff'}">${isHS?'⚠ HS':'✓ OK'}</span></td><td style="padding:5px 7px;font-size:9px;font-weight:600">${f.motif||'—'}</td><td style="padding:5px 7px;font-size:8px;color:#64748b;font-style:italic">${(f.note||'').replace(/</g,'&lt;')||'—'}</td></tr>`;
    });
    hsTableSection=`<div style="margin-top:18px;page-break-before:auto"><div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #0f172a">Audit fibres HS · Détails</div><table style="width:100%;border-collapse:collapse;font-size:9px"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:6px 7px;text-align:center">Tiroir</th><th style="padding:6px 7px;text-align:center">Pos.</th><th style="padding:6px 7px;text-align:left">Couleur</th><th style="padding:6px 7px;text-align:left">Réf PBO</th><th style="padding:6px 7px;text-align:left">ID ROP</th><th style="padding:6px 7px;text-align:left">PTO</th><th style="padding:6px 7px;text-align:center">Statut</th><th style="padding:6px 7px;text-align:left">Motif</th><th style="padding:6px 7px;text-align:left">Note</th></tr></thead><tbody>${hsRows}</tbody></table></div>`;
  }

  // Surplus jarretieres section (only if cmd analysis available)
  let surplusSection='';
  if(cmdAnalysis){
    const totalSurplus=Object.values(cmdAnalysis).filter(a=>a.surplus).reduce((s,a)=>s+a.diff,0);
    const OPC={'FREE':{bg:'#FCEBEB',bd:'#E24B4A',tx:'#A32D2D',label:'FREE · ROUGE'},'ORANGE':{bg:'#FAEEDA',bd:'#EF9F27',tx:'#854F0B',label:'ORANGE'},'BOUYGUES':{bg:'#EAF3DE',bd:'#97C459',tx:'#3B6D11',label:'BOUYGUES · VERT'},'SFR':{bg:'#E6F1FB',bd:'#378ADD',tx:'#185FA5',label:'SFR · BLEU'}};
    let cards='';
    Object.keys(OPC).forEach(op=>{
      const a=cmdAnalysis[op],col=OPC[op];
      cards+='<div style="background:#fff;border:1px solid #e2e8f0;border-left:4px solid '+col.bd+';padding:10px;border-radius:6px"><div style="font-size:10px;color:'+col.tx+';font-weight:700;letter-spacing:.5px">'+col.label+'</div><div style="display:flex;align-items:baseline;gap:4px;margin-top:4px"><span style="font-size:20px;font-weight:900">'+a.terrain+'</span><span style="font-size:10px;color:#94a3b8">/ '+a.commandes+' cmd</span></div><div style="font-size:11px;color:'+(a.surplus?'#dc2626':'#15803d')+';margin-top:3px;font-weight:700">'+(a.surplus?'⚠ +'+a.diff+' surplus':(a.diff===0?'✓ Égal':'✓ '+a.diff+' OK'))+'</div></div>';
    });
    let opDetails='';
    Object.keys(OPC).forEach(op=>{
      const a=cmdAnalysis[op];
      if(!a.surplus)return;
      const col=OPC[op];
      const positions=a.positionsPasDeNo.slice().sort((x,y)=>{if(x.tiroir!==y.tiroir)return parseInt(x.tiroir)-parseInt(y.tiroir);return x.position.localeCompare(y.position);});
      if(positions.length===0){
        opDetails+='<div style="margin-bottom:14px;page-break-inside:avoid"><div style="background:'+col.bg+';padding:10px 14px;border-radius:6px;border:1px solid '+col.bd+'"><div style="font-size:13px;font-weight:800;color:'+col.tx+'">'+op+' — Aucune position sans n°</div><div style="font-size:11px;color:#64748b;margin-top:4px;font-style:italic">+'+a.diff+' surplus avec SSN identifié — investigation manuelle requise</div></div></div>';
        return;
      }
      const rows=positions.map((p,i)=>'<tr style="background:'+(i%2===0?'#fff':'#f8fafc')+'"><td style="padding:6px 10px;font-family:monospace;font-size:11px;text-align:center;font-weight:700">T'+p.tiroir+'</td><td style="padding:6px 10px;font-family:monospace;font-size:11px;text-align:center;font-weight:700;color:'+col.tx+'">'+p.position+'</td><td style="padding:6px 10px;font-size:10px;color:#64748b">'+(p.ssn||'—')+'</td><td style="padding:6px 10px;text-align:center"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+col.bd+';margin-right:4px"></span><span style="font-size:11px">'+a.color+'</span></td></tr>').join('');
      opDetails+='<div style="margin-bottom:14px;page-break-inside:avoid"><div style="display:flex;align-items:center;justify-content:space-between;background:'+col.bg+';padding:8px 14px;border-radius:6px 6px 0 0;border:1px solid '+col.bd+';border-bottom:none"><div style="font-size:12px;font-weight:800;color:'+col.tx+'">'+op+' — '+positions.length+' position'+(positions.length>1?'s':'')+' sans n° à investiguer</div><div style="font-size:10px;font-weight:700;padding:2px 8px;background:#fff;color:'+col.tx+';border-radius:4px;border:1px solid '+col.bd+'">+'+a.diff+' surplus</div></div><table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;border:1px solid '+col.bd+'"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:6px 10px;text-align:center;font-size:10px">Tiroir</th><th style="padding:6px 10px;text-align:center;font-size:10px">Position</th><th style="padding:6px 10px;text-align:left;font-size:10px">SSN</th><th style="padding:6px 10px;text-align:center;font-size:10px">Couleur</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    });
    surplusSection=`<div style="page-break-before:always"><div style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #0f172a">Analyse commandes opérateurs · Jarretières en surplus</div><div style="background:`+(totalSurplus>0?'#fef3c7':'#dcfce7')+`;border:1px solid `+(totalSurplus>0?'#fde047':'#86efac')+`;border-radius:8px;padding:10px 14px;margin-bottom:14px"><div style="font-size:12px;font-weight:700;color:`+(totalSurplus>0?'#854d0e':'#15803d')+`">`+(totalSurplus>0?'⚠️ '+totalSurplus+' jarretière'+(totalSurplus>1?'s':'')+' en surplus détectée'+(totalSurplus>1?'s':''):'✅ Aucun écart détecté')+`</div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px">`+cards+`</div>`+(opDetails||'')+`</div>`;
  }
  const html=`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Rapport PM · ${fname}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#0f172a;font-size:12px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:12mm;size:A4}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:12px;border-bottom:3px solid #0f172a">
    <div><div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#003087;margin-bottom:4px">Rapport PM · XP Fibre SFR</div><div style="font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-.5px">${fname}</div><div style="font-size:11px;color:#64748b;margin-top:3px">Généré le ${dateR}</div></div>
    <div style="text-align:right"><div style="background:#E2001A;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:4px;display:inline-block">SFR</div></div>
  </div>
  ${isHSMode?`
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:16px">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">Tiroirs</div><div style="font-size:20px;font-weight:900;color:#003087;margin-top:3px">${tiroirs.length}</div></div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">Positions</div><div style="font-size:20px;font-weight:900;color:#0f172a;margin-top:3px">${total}</div></div>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#1d4ed8;text-transform:uppercase;letter-spacing:.5px">Auditées</div><div style="font-size:20px;font-weight:900;color:#1d4ed8;margin-top:3px">${hsTotal}</div></div>
    <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#A32D2D;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Fibres HS</div><div style="font-size:20px;font-weight:900;color:#A32D2D;margin-top:3px">${hsCount}</div></div>
    <div style="background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#15803d;text-transform:uppercase;letter-spacing:.5px;font-weight:700">Fibres OK</div><div style="font-size:20px;font-weight:900;color:#15803d;margin-top:3px">${okCount}</div></div>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#1d4ed8;text-transform:uppercase;letter-spacing:.5px">Avancement</div><div style="font-size:20px;font-weight:900;color:#1d4ed8;margin-top:3px">${hsPct}%</div></div>
  </div>`:`
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">Tiroirs</div><div style="font-size:20px;font-weight:900;color:#003087;margin-top:3px">${tiroirs.length}</div></div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px">Positions</div><div style="font-size:20px;font-weight:900;color:#0f172a;margin-top:3px">${total}</div></div>
    <div style="background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#15803d;text-transform:uppercase;letter-spacing:.5px">Libres</div><div style="font-size:20px;font-weight:900;color:#15803d;margin-top:3px">${libres}</div></div>
    <div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#dc2626;text-transform:uppercase;letter-spacing:.5px">Occupées</div><div style="font-size:20px;font-weight:900;color:#dc2626;margin-top:3px">${occ}</div></div>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;text-align:center"><div style="font-size:9px;color:#1d4ed8;text-transform:uppercase;letter-spacing:.5px">Occupation</div><div style="font-size:20px;font-weight:900;color:#1d4ed8;margin-top:3px">${Math.round(occ/total*100)}%</div></div>
  </div>`}
  <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">Légende</div>${legH}
  <div style="margin-top:16px;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;padding-bottom:5px;border-bottom:2px solid #0f172a">Grille des tiroirs</div>
  ${tirnb}${hsTableSection}${photosH}${surplusSection}
  <script>window.onload=function(){window.print()};<\/script></body></html>`;
  const w=window.open('','_blank');if(!w){alert('Autorisez les pop-ups.');return;}w.document.write(html);w.document.close();
}

// ══════════════════════════════════════════════
// PBO MODULE
// ══════════════════════════════════════════════
function updatePBOStats(){
  const total=pboData.length,fibres=pboData.reduce((s,p)=>s+p.fibres.length,0);
  const actif=pboData.reduce((s,p)=>s+p.fibres.filter(f=>f.client==='Oui').length,0);
  const amod=pboData.reduce((s,p)=>s+p.fibres.filter(f=>f.conformite==='A modifier').length,0);
  const aud=pboData.filter(p=>p.audite).length;
  document.getElementById('pbo-stats').innerHTML=scCard('PBO',total,'var(--blue)')+scCard('Fibres',fibres)+scCard('Actifs',actif,'var(--green)')+scCard('Modifier',amod,'var(--red)')+scCard('Audités',aud+'/'+total,aud===total&&total>0?'var(--green)':'var(--text)');
}

function filterPBOs(){
  const s=(document.getElementById('pbo-search')?.value||'').toLowerCase();
  const fc=document.getElementById('pbo-fconf')?.value||'';
  const fau=document.getElementById('pbo-faudit')?.value||'';
  const filtered=pboData.filter(pbo=>{
    if(s&&!pbo.reference_pbo.toLowerCase().includes(s)&&!pbo.cable.toLowerCase().includes(s)&&!pbo.fibres.some(f=>f.modpm.toLowerCase().includes(s)||f.pto.toLowerCase().includes(s)))return false;
    if(fc&&!pbo.fibres.some(f=>f.conformite===fc))return false;
    if(fau==='audite'&&!pbo.audite)return false;
    if(fau==='pending'&&pbo.audite)return false;
    return true;
  });
  document.getElementById('pbo-count').textContent=filtered.length+' PBO'+(filtered.length>1?'s':'')+' sur '+pboData.length;
  const list=document.getElementById('pbo-list');list.innerHTML='';
  filtered.forEach(pbo=>list.appendChild(buildPBOCard(pbo)));
}

function buildPBOCard(pbo){
  const sid=pbo.reference_pbo.replace(/[^a-z0-9]/gi,'_');
  const cm=gc(pbo.couleur_tube);
  const actif=pbo.fibres.filter(f=>f.client==='Oui').length;
  const amod=pbo.fibres.filter(f=>f.conformite==='A modifier').length;
  const card=document.createElement('div');card.className='pbo-card';card.id='card-'+sid;
  const hdr=document.createElement('div');hdr.className='pbo-card-hdr';hdr.onclick=()=>toggleCard(sid);
  rebuildHdrContent(hdr,pbo);card.appendChild(hdr);
  const body=document.createElement('div');body.className='pbo-body';body.id='body-'+sid;
  const tbl=document.createElement('div');tbl.style.overflowX='auto';
  const table=document.createElement('table');table.className='fibre-table';
  table.innerHTML='<thead><tr><th>N°</th><th>Fibre PBO</th><th>Tube PBO</th><th>Module PM</th><th>Position</th><th>Réf PTO</th><th>Client</th><th>Conformité</th><th>Note</th><th style="width:68px">Actions</th></tr></thead>';
  const tbody=document.createElement('tbody');tbody.id='tbody-'+sid;
  [...pbo.fibres].sort((a,b)=>{
    const na=parseInt(a.num)||0,nb=parseInt(b.num)||0;
    if(na!==nb)return na-nb;
    return (parseInt(a.pospm)||0)-(parseInt(b.pospm)||0);
  }).forEach(f=>tbody.appendChild(buildRow(pbo,f)));
  table.appendChild(tbody);tbl.appendChild(table);body.appendChild(tbl);
  const addDiv=document.createElement('div');addDiv.style.cssText='padding:8px 14px;display:flex;justify-content:flex-end';
  addDiv.innerHTML=`<button class="btn-add-fibre" onclick="addFibre('${pbo.reference_pbo}')">+ Ajouter une fibre</button>`;
  body.appendChild(addDiv);
  const footer=document.createElement('div');footer.className='pbo-footer';
  const photoSec=document.createElement('div');photoSec.className='photo-sec';photoSec.id='psec-'+sid;
  photoSec.innerHTML=`<div class="photo-sec-title">📷 Photos terrain</div><div class="photo-grid" id="pgrid-${sid}"><div class="photo-empty">Aucune photo</div></div><div class="photo-btns"><label class="btn-photo">📁 Choisir<input type="file" accept="image/*" multiple onchange="addPhotos('${pbo.reference_pbo}',this.files)" style="display:none"></label><label class="btn-photo">📸 Photo<input type="file" accept="image/*" capture="environment" onchange="addPhotos('${pbo.reference_pbo}',this.files)" style="display:none"></label></div>`;
  footer.appendChild(photoSec);
  const valSec=document.createElement('div');valSec.className='validate-sec';valSec.id='vsec-'+sid;
  buildValidateContent(valSec,pbo);footer.appendChild(valSec);
  body.appendChild(footer);card.appendChild(body);
  return card;
}
function rebuildHdrContent(hdr,pbo){
  const cm=gc(pbo.couleur_tube);const actif=pbo.fibres.filter(f=>f.client==='Oui').length;const amod=pbo.fibres.filter(f=>f.conformite==='A modifier').length;
  hdr.innerHTML=`<span class="pbo-ref">${pbo.reference_pbo}</span><span class="pbo-cable">${pbo.cable}</span><span class="tube-badge" style="background:${cm.bg};border-color:${cm.bd};color:${cm.tx}">Tube ${pbo.couleur_tube||'?'}</span><span style="font-size:10px;color:var(--text3);font-family:var(--mono)">${pbo.fibres.length} fibres</span>${actif>0?`<span class="pbo-actif-badge">${actif} actif${actif>1?'s':''}</span>`:''}${amod>0?`<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;background:var(--red-lt);color:var(--red);border:1px solid rgba(226,0,26,.25)">${amod} à modifier</span>`:''}${pbo.audite?`<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:3px;background:var(--green-lt);color:var(--green);border:1px solid rgba(26,124,62,.25)">✅ AUDITÉ</span>`:''}<span class="pbo-card-arrow" id="arr-${pbo.reference_pbo.replace(/[^a-z0-9]/gi,'_')}">▼</span>`;
}
function buildValidateContent(el,pbo){
  const hasIssues=pbo.fibres.some(f=>f.conformite==='Non verifie'||f.conformite==='A modifier');
  if(pbo.audite){el.innerHTML=`<div class="audite-stamp"><span style="font-size:22px">✅</span><div class="audite-stamp-text"><div class="title">PBO AUDITÉ &amp; VÉRIFIÉ</div><div class="date">${pbo.audite_date||''}</div></div><button class="btn-unvalidate" onclick="unvalidate('${pbo.reference_pbo}')">↩ Annuler</button></div>`;}
  else{el.innerHTML=(hasIssues?'<div class="audit-warn"><span>⚠️</span><span>Fibres non vérifiées</span></div>':'')+`<button class="btn-validate${hasIssues?' warn':''}" onclick="validate('${pbo.reference_pbo}')"><span class="btn-validate-icon">✓</span><span>Marquer PBO audité &amp; vérifié</span></button>`;}
}
function refreshCard(pbo){
  const sid=pbo.reference_pbo.replace(/[^a-z0-9]/gi,'_');
  const hdr=document.querySelector('#card-'+sid+' .pbo-card-hdr');if(hdr)rebuildHdrContent(hdr,pbo);
  const vsec=document.getElementById('vsec-'+sid);if(vsec)buildValidateContent(vsec,pbo);
  updatePBOStats();syncPBOToMission();
}
function toggleCard(sid){const body=document.getElementById('body-'+sid),arr=document.getElementById('arr-'+sid);if(!body)return;const open=body.classList.toggle('open');if(arr)arr.classList.toggle('open',open);}

function buildRow(pbo,f){
  const tr=document.createElement('tr');tr.id='row-'+f.id;
  const editing=f.conformite==='A modifier';
  // Check if this fibre has the same num + tube as another (duplicate detection)
  const isDup = pbo.fibres.filter(x=>x.id!==f.id && x.num===f.num && (x.ctpm||'')===(f.ctpm||'') && f.num).length > 0;
  if(isDup && !editing){tr.style.background='rgba(245,158,11,.06)';tr.style.borderLeft='3px solid #F59E0B';tr.title='⚠️ Numéro de fibre en doublon dans ce tube';}
  if(editing){
    tr.style.background='rgba(226,0,26,.04)';tr.style.borderLeft='3px solid var(--red)';
    tr.innerHTML=`<td data-label="N° Fibre"><input class="cell-input" style="width:34px" value="${esc(f.num)}" onchange="upd('${pbo.reference_pbo}','${f.id}','num',this.value)"></td><td data-label="Fibre PBO">${colorSel('cfpbo',pbo.reference_pbo,f.id,f.cfpbo)}</td><td data-label="Tube PBO">${colorSel('ctpbo',pbo.reference_pbo,f.id,f.ctpbo||pbo.couleur_tube)}</td><td data-label="Module PM"><input class="cell-input" style="width:110px" value="${esc(f.modpm)}" onchange="upd('${pbo.reference_pbo}','${f.id}','modpm',this.value)"></td><td data-label="Position"><input class="cell-input" style="width:44px" value="${esc(f.pospm)}" onchange="upd('${pbo.reference_pbo}','${f.id}','pospm',this.value)"></td><td data-label="Réf PTO"><input class="cell-input" style="width:100px" value="${esc(f.pto)}" onchange="upd('${pbo.reference_pbo}','${f.id}','pto',this.value)"></td><td data-label="Client"><select class="conf-sel" onchange="upd('${pbo.reference_pbo}','${f.id}','client',this.value)"><option${f.client==='Oui'?' selected':''}>Oui</option><option${f.client!=='Oui'?' selected':''}>Non</option></select></td><td data-label="Conformité"><select class="conf-sel conf-mod" onchange="setConf('${pbo.reference_pbo}','${f.id}',this.value)"><option>Non verifie</option><option>Conforme</option><option selected>A modifier</option></select></td><td data-label="Note"><input class="note-inp" placeholder="Note..." value="${esc(f.note)}" onchange="upd('${pbo.reference_pbo}','${f.id}','note',this.value)"></td><td><div style="display:flex;gap:3px"><button class="btn-act btn-save-row" onclick="saveRow('${pbo.reference_pbo}','${f.id}')" title="Valider">✓</button><button class="btn-act btn-del-row" onclick="delFibre('${pbo.reference_pbo}','${f.id}')" title="Supprimer">✕</button></div></td>`;
  }else{
    const ccls=f.conformite==='Conforme'?'conf-ok':f.conformite==='A modifier'?'conf-mod':'conf-nv';
    tr.innerHTML=`<td data-label="N° Fibre" style="color:var(--text)">${f.num||'—'}</td><td data-label="Fibre PBO">${pill(f.cfpbo)}</td><td data-label="Tube PBO">${pill(pbo.couleur_tube)}</td><td data-label="Module PM" style="font-size:10px;color:var(--text)">${f.modpm||'—'}</td><td data-label="Position" style="color:var(--blue)">${f.pospm||'—'}</td><td data-label="Réf PTO" style="font-size:10px">${f.pto||'<span style="color:var(--text4)">—</span>'}</td><td data-label="Client"><span style="font-size:10px;font-weight:700;color:${f.client==='Oui'?'var(--green)':'var(--text4)'}">${f.client==='Oui'?'● Actif':'○ Non'}</span></td><td data-label="Conformité"><select class="conf-sel ${ccls}" onchange="setConf('${pbo.reference_pbo}','${f.id}',this.value)"><option${f.conformite==='Non verifie'?' selected':''}>Non verifie</option><option${f.conformite==='Conforme'?' selected':''}>Conforme</option><option${f.conformite==='A modifier'?' selected':''}>A modifier</option></select></td><td data-label="Note"><input class="note-inp" placeholder="Note..." value="${esc(f.note)}" onchange="upd('${pbo.reference_pbo}','${f.id}','note',this.value)"></td><td><div style="display:flex;gap:3px"><button class="btn-act btn-edit-row" onclick="editRow('${pbo.reference_pbo}','${f.id}')" title="Modifier">✎</button><button class="btn-act btn-del-row" onclick="delFibre('${pbo.reference_pbo}','${f.id}')" title="Supprimer">✕</button></div></td>`;
  }
  return tr;
}
function getPBO(ref){return pboData.find(p=>p.reference_pbo===ref);}
function getFib(pbo,id){return pbo.fibres.find(f=>f.id===id);}
function reRR(pbo,f){const tr=document.getElementById('row-'+f.id);if(tr)tr.replaceWith(buildRow(pbo,f));}
function upd(pref,fid,field,val){
  const pbo=getPBO(pref);if(!pbo)return;
  const f=getFib(pbo,fid);if(!f)return;
  // Special case: ctpbo (tube PBO color) modifies the parent PBO, not the fibre
  if(field==='ctpbo'){
    pbo.couleur_tube=val;
    // Save to DB at PBO level
    if(pbo.id){
      clearTimeout(window['_savpbo_'+pbo.id]);
      window['_savpbo_'+pbo.id]=setTimeout(async()=>{
        const{error}=await sb.from('pbo_data').update({couleur_tube:val}).eq('id',pbo.id);
        if(error)console.error('Save PBO error:',error);
      },500);
    }
    clearTimeout(window._syncT);
    window._syncT=setTimeout(syncPBOToMission,800);
    return;
  }
  f[field]=val;
  const dbMap={num:'num_fibre',cfpbo:'couleur_fibre_pbo',ctpm:'couleur_tube_pm',cfpm:'couleur_fibre_pm',modpm:'reference_module_pm',pospm:'position_module_pm',client:'client_actif',pto:'reference_pto',note:'note'};
  const dbField=dbMap[field];
  if(dbField && f.id){
    clearTimeout(window['_sav_'+fid]);
    window['_sav_'+fid]=setTimeout(async()=>{
      const upd={};upd[dbField]=val;
      const{error}=await sb.from('fibres').update(upd).eq('id',f.id);
      if(error)console.error('Save error:',error);
    },500);
  }
  clearTimeout(window._syncT);
  window._syncT=setTimeout(syncPBOToMission,800);
}
async function setConf(pref,fid,val){
  const pbo=getPBO(pref);if(!pbo)return;
  const f=getFib(pbo,fid);if(!f)return;
  f.conformite=val;reRR(pbo,f);refreshCard(pbo);
  if(f.id){const{error}=await sb.from('fibres').update({conformite:val}).eq('id',f.id);if(error)console.error('Save conformite:',error);}
}
async function editRow(pref,fid){
  const pbo=getPBO(pref);if(!pbo)return;
  const f=getFib(pbo,fid);if(!f)return;
  f.conformite='A modifier';reRR(pbo,f);refreshCard(pbo);
  if(f.id)await sb.from('fibres').update({conformite:'A modifier'}).eq('id',f.id);
}
async function saveRow(pref,fid){
  const pbo=getPBO(pref);if(!pbo)return;
  const f=getFib(pbo,fid);if(!f)return;
  if(f.conformite==='A modifier')f.conformite='Conforme';
  reRR(pbo,f);refreshCard(pbo);
  if(f.id)await sb.from('fibres').update({conformite:f.conformite}).eq('id',f.id);
}
async function delFibre(pref,fid){
  if(!confirm('Supprimer cette fibre et renuméroter les suivantes ?'))return;
  const pbo=getPBO(pref);if(!pbo)return;
  if(fid && fid.length>20)await sb.from('fibres').delete().eq('id',fid);
  pbo.fibres=pbo.fibres.filter(f=>f.id!==fid);
  // Renumber: sort by current num and reassign 1, 2, 3...
  const sorted=[...pbo.fibres].sort((a,b)=>(parseInt(a.num)||0)-(parseInt(b.num)||0));
  for(let i=0;i<sorted.length;i++){
    const newNum=String(i+1);
    if(sorted[i].num !== newNum){
      sorted[i].num=newNum;
      if(sorted[i].id && sorted[i].id.length>20){
        await sb.from('fibres').update({num_fibre:newNum}).eq('id',sorted[i].id);
      }
    }
  }
  const tr=document.getElementById('row-'+fid);if(tr)tr.remove();
  // Re-render all rows to reflect new numbers
  const sid=pref.replace(/[^a-z0-9]/gi,'_');
  const tbody=document.getElementById('tbody-'+sid);
  if(tbody){
    tbody.innerHTML='';
    [...pbo.fibres].sort((a,b)=>{
      const na=parseInt(a.num)||0,nb=parseInt(b.num)||0;
      if(na!==nb)return na-nb;
      return (parseInt(a.pospm)||0)-(parseInt(b.pospm)||0);
    }).forEach(f=>tbody.appendChild(buildRow(pbo,f)));
  }
  refreshCard(pbo);
}
async function addFibre(pref){
  const pbo=getPBO(pref);if(!pbo)return;
  if(!pbo.pbo_db_id){alert('PBO non sync DB');return;}
  // Auto-increment: find max fibre number in this PBO and add 1
  const maxNum = pbo.fibres.reduce((max,fb)=>{
    const n = parseInt(fb.num)||0;
    return n > max ? n : max;
  },0);
  const nextNum = String(maxNum + 1);
  const{data,error}=await sb.from('fibres').insert({
    pbo_id:pbo.pbo_db_id,
    mission_id:selectedMissionId,
    conformite:'A modifier',
    client_actif:'Non',
    num_fibre:nextNum
  }).select().single();
  if(error){alert('Erreur: '+error.message);return;}
  const f={id:data.id,num:nextNum,cfpbo:'',ctpm:'',cfpm:'',modpm:'',pospm:'',client:'Non',pto:'',statut_pto:'',conformite:'A modifier',note:''};
  pbo.fibres.push(f);
  const sid=pref.replace(/[^a-z0-9]/gi,'_');
  const tbody=document.getElementById('tbody-'+sid);
  if(tbody){const row=buildRow(pbo,f);tbody.appendChild(row);row.scrollIntoView({behavior:'smooth',block:'nearest'});}
  refreshCard(pbo);
}

// Photos PBO
async function addPhotos(pref,files){
  if(!files||!files.length)return;
  if(!pboPhotos[pref])pboPhotos[pref]=[];
  const pbo=getPBO(pref);
  for(const file of Array.from(files)){
    // Show local preview first
    const reader=new FileReader();
    const dataUrl=await new Promise(res=>{reader.onload=e=>res(e.target.result);reader.readAsDataURL(file);});
    const photoEntry={name:file.name,dataUrl:dataUrl,uploading:true};
    pboPhotos[pref].push(photoEntry);
    renderPhotos(pref);
    // Upload to Supabase Storage
    if(selectedMissionId && pbo?.pbo_db_id){
      try{
        const path=selectedMissionId+'/'+pbo.pbo_db_id+'/'+Date.now()+'_'+file.name.replace(/[^a-z0-9.]/gi,'_');
        const{error:upErr}=await sb.storage.from('photos').upload(path,file,{cacheControl:'3600',upsert:false});
        if(upErr){console.error('Upload error:',upErr);photoEntry.error=true;}
        else{
          const{data:urlData}=sb.storage.from('photos').getPublicUrl(path);
          photoEntry.path=path;photoEntry.url=urlData.publicUrl;photoEntry.uploading=false;
          // Save reference in DB
          await sb.from('photos').insert({mission_id:selectedMissionId,pbo_id:pbo.pbo_db_id,type:'pbo',storage_path:path,nom_fichier:file.name,uploaded_par:currentUser.id});
        }
      }catch(err){console.error(err);photoEntry.error=true;}
      renderPhotos(pref);
    }
  }
}
function renderPhotos(pref){
  const sid=pref.replace(/[^a-z0-9]/gi,'_');
  const grid=document.getElementById('pgrid-'+sid);
  if(!grid)return;
  const photos=pboPhotos[pref]||[];
  if(!photos.length){grid.innerHTML='<div class="photo-empty">Aucune photo</div>';return;}
  grid.innerHTML=photos.map((ph,i)=>{
    const src=ph.url||ph.dataUrl;
    const overlay=ph.uploading?'<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-family:monospace">⏳</div>':ph.error?'<div style="position:absolute;inset:0;background:rgba(226,0,26,.7);border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px">⚠</div>':'';
    return '<div class="photo-thumb-wrap"><img class="photo-thumb" src="'+src+'" onclick="openModal(\''+pref+'\','+i+')" title="'+esc(ph.name)+'">'+overlay+'<button class="photo-del" onclick="delPhoto(\''+pref+'\','+i+')">✕</button><div class="photo-name">'+ph.name.slice(0,14)+(ph.name.length>14?'…':'')+'</div></div>';
  }).join('');
}
async function delPhoto(pref,idx){
  if(!pboPhotos[pref])return;
  const photo=pboPhotos[pref][idx];
  if(photo?.path){
    try{await sb.storage.from('photos').remove([photo.path]);await sb.from('photos').delete().eq('storage_path',photo.path);}catch(e){console.error('Delete photo error:',e);}
  }
  pboPhotos[pref].splice(idx,1);
  renderPhotos(pref);
}
function openModal(pref,idx){const ph=(pboPhotos[pref]||[])[idx];if(!ph)return;document.getElementById('modal-img').src=ph.dataUrl;document.getElementById('modal-name').textContent=ph.name;document.getElementById('photo-modal').classList.add('open');}

// Validate PBO
async function validate(pref){
  const pbo=getPBO(pref);if(!pbo)return;
  const issues=pbo.fibres.some(f=>f.conformite==='Non verifie'||f.conformite==='A modifier');
  if(issues&&!confirm('Certaines fibres non conformes. Valider quand même ?'))return;
  pbo.audite=true;pbo.audite_date=new Date().toLocaleString('fr-FR');
  // Save to DB if we have db id
  if(pbo.pbo_db_id){await sb.from('pbo_data').update({audite:true,audite_date:new Date().toISOString(),audite_par:currentUser.id}).eq('id',pbo.pbo_db_id);}
  refreshCard(pbo);syncPBOToMission();
}
async function unvalidate(pref){
  const pbo=getPBO(pref);if(!pbo)return;
  pbo.audite=false;pbo.audite_date='';
  if(pbo.pbo_db_id){await sb.from('pbo_data').update({audite:false,audite_date:null}).eq('id',pbo.pbo_db_id);}
  refreshCard(pbo);syncPBOToMission();
}

// Sync PBO edits back to mission in memory (for rapport)
function syncPBOToMission(){
  if(!selectedMissionId)return;
  const m=missions.find(x=>x.id===selectedMissionId);
  if(!m||!m.pbo_data)return;
  pboData.forEach(pbo=>{
    const dbPBO=m.pbo_data.find(p=>p.reference_pbo===pbo.reference_pbo);
    if(dbPBO){dbPBO.audite=pbo.audite;dbPBO.audite_date=pbo.audite_date;
      pbo.fibres.forEach(f=>{const dbF=dbPBO.fibres?.find(x=>x.id===f.id);if(dbF){dbF.conformite=f.conformite;dbF.note=f.note;}});}
  });
}

// Export CSV pour une mission spécifique (depuis la liste)
async function exportMissionCSV(missionId){
  // Force reload from DB to get latest data (modifications might be still in cache)
  await loadMissions();
  const m = missions.find(x=>x.id===missionId);
  if(!m||!m.pbo_data?.length){alert('Aucune donnée à exporter.');return;}
  let csv='reference PM;reference PBO;couleur tube PBO;cable;N fibre;couleur fibre PBO;couleur tube PM;couleur fibre PM;module PM;position PM;reference PTO;client actif;conformite;note;statut audit;date audit\n';
  // Sort: audited first then alphabetical
  const sorted = [...m.pbo_data].sort((a,b)=>{
    if(a.audite && !b.audite)return -1;
    if(!a.audite && b.audite)return 1;
    return (a.reference_pbo||'').localeCompare(b.reference_pbo||'');
  });
  sorted.forEach(pbo=>{
    const fibres = [...(pbo.fibres||[])].sort((a,b)=>{
      const na=parseInt(a.num_fibre)||0,nb=parseInt(b.num_fibre)||0;
      if(na!==nb)return na-nb;
      return (parseInt(a.position_module_pm)||0)-(parseInt(b.position_module_pm)||0);
    });
    fibres.forEach(f=>{
      const note=(f.note||'').replace(/;/g,',').replace(/\n/g,' ');
      csv+='"'+m.ref_pm+'";"'+pbo.reference_pbo+'";"'+(pbo.couleur_tube||'')+'";"'+(pbo.cable||'')+'";"'+(f.num_fibre||'')+'";"'+(f.couleur_fibre_pbo||'')+'";"'+(f.couleur_tube_pm||'')+'";"'+(f.couleur_fibre_pm||'')+'";"'+(f.reference_module_pm||'')+'";"'+(f.position_module_pm||'')+'";"'+(f.reference_pto||'')+'";"'+(f.client_actif||'')+'";"'+(f.conformite||'')+'";"'+note+'";"'+(pbo.audite?'Audite':'En attente')+'";"'+(pbo.audite_date?new Date(pbo.audite_date).toLocaleString('fr-FR'):'')+'"\n';
    });
  });
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='audit_'+m.ref_pm.replace(/[^a-z0-9]/gi,'_')+'_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
}

// Export CSV
function exportCSV(){
  let csv='reference PBO;couleur tube PBO;N fibre;couleur fibre PBO;couleur tube PM;couleur fibre PM;module PM;position PM;reference PTO;client actif;conformite;note;statut audit;date audit\n';
  pboData.forEach(pbo=>{pbo.fibres.forEach(f=>{const note=(f.note||'').replace(/;/g,',');csv+=`"${pbo.reference_pbo}";"${pbo.couleur_tube}";"${f.num}";"${f.cfpbo}";"${f.ctpm}";"${f.cfpm}";"${f.modpm}";"${f.pospm}";"${f.pto}";"${f.client}";"${f.conformite}";"${note}";"${pbo.audite?'Audite':'En attente'}";"${pbo.audite_date||''}"\n`;});});
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='audit_pbo_'+new Date().toISOString().slice(0,10)+'.csv';a.click();
}

// Export PDF PBO (simplified)
function exportPDF(){alert('Export PDF disponible via le bouton Rapport dans la vue Bureau d\'études.');}
function exportRapportPDF(missionId){
  const m = missions.find(x => x.id === missionId);
  if (!m || !m.pbo_data?.length) { alert('Aucun rapport disponible.'); return; }
  const pboList = m.pbo_data;
  const audites = pboList.filter(p => p.audite).length;
  const totalF = pboList.reduce((s,p)=>s+(p.fibres?.length||0),0);
  const conf = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='Conforme').length||0),0);
  const amod = pboList.reduce((s,p)=>s+(p.fibres?.filter(f=>f.conformite==='A modifier').length||0),0);
  const avPct = pboList.length > 0 ? Math.round(audites/pboList.length*100) : 0;
  const SOLID = {rouge:'#ef4444',vert:'#22c55e',bleu:'#003087',jaune:'#f59e0b',violet:'#8b5cf6',blanc:'#9ca3af',orange:'#f97316',noir:'#374151',turquoise:'#06b6d4',rose:'#ec4899'};
  function sol(c) { return SOLID[(c||'').toLowerCase()]||'#888'; }
  function cb(cf) {
    if(cf==='Conforme')return 'background:#dcfce7;color:#15803d;border:1px solid #86efac';
    if(cf==='A modifier')return 'background:#fee2e2;color:#dc2626;border:1px solid #fca5a5';
    return 'background:#f1f5f9;color:#64748b;border:1px solid #cbd5e1';
  }
  const tech = m.tech;
  const dateR = new Date().toLocaleString('fr-FR');
  
  const pboCards = [...pboList].sort((a,b)=>{
    if(a.audite && !b.audite)return -1;
    if(!a.audite && b.audite)return 1;
    return (a.reference_pbo||'').localeCompare(b.reference_pbo||'');
  }).map((pbo) => {
    const fibres = [...(pbo.fibres||[])].sort((a,b)=>{
      const na=parseInt(a.num_fibre)||0,nb=parseInt(b.num_fibre)||0;
      if(na!==nb)return na-nb;
      return (parseInt(a.position_module_pm)||0)-(parseInt(b.position_module_pm)||0);
    });
    const rows = fibres.map((f,fi) =>
      '<tr style="background:'+(fi%2===0?'#fff':'#f8fafc')+'">'+
        '<td style="padding:5px 9px;font-family:monospace;text-align:center;font-weight:700;font-size:10px">'+(f.num_fibre||'—')+'</td>'+
        '<td style="padding:5px 9px"><span style="display:inline-flex;align-items:center;gap:4px;font-size:10px"><span style="width:8px;height:8px;border-radius:50%;background:'+sol(f.couleur_fibre_pbo)+';display:inline-block;flex-shrink:0"></span>'+(f.couleur_fibre_pbo||'—')+'</span></td>'+
        '<td style="padding:5px 9px"><span style="display:inline-flex;align-items:center;gap:4px;font-size:10px"><span style="width:8px;height:8px;border-radius:50%;background:'+sol(pbo.couleur_tube)+';display:inline-block;flex-shrink:0"></span>'+(pbo.couleur_tube||'—')+'</span></td>'+
        '<td style="padding:5px 9px;font-size:9px;font-family:monospace">'+(f.reference_module_pm||'—')+'</td>'+
        '<td style="padding:5px 9px;text-align:center;font-weight:700;color:#1d4ed8;font-size:10px">'+(f.position_module_pm||'—')+'</td>'+
        '<td style="padding:5px 9px;font-size:9px;color:#475569">'+(f.reference_pto||'—')+'</td>'+
        '<td style="padding:5px 9px;text-align:center;font-weight:700;color:'+(f.client_actif==='Oui'?'#16a34a':'#94a3b8')+';font-size:10px">'+(f.client_actif==='Oui'?'●':'○')+'</td>'+
        '<td style="padding:5px 9px"><span style="padding:2px 6px;border-radius:8px;font-size:9px;font-weight:700;'+cb(f.conformite)+'">'+(f.conformite==='Conforme'?'✓ Conforme':f.conformite==='A modifier'?'⚠ À modifier':'— Non vérifié')+'</span></td>'+
        '<td style="padding:5px 9px;font-size:9px;color:#64748b;font-style:italic">'+(f.note||'')+'</td>'+
      '</tr>'
    ).join('');
    // Get photos for this PBO
    const photos = pboPhotos[pbo.reference_pbo] || [];
    const photosHtml = photos.length > 0 ? '<div style="padding:10px 14px;border-top:1px solid #e2e8f0;background:#fafbfc"><div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">📷 Photos terrain ('+photos.length+')</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">'+photos.map(p=>'<div><img src="'+(p.url||p.dataUrl)+'" style="width:100%;height:100px;object-fit:cover;border-radius:4px;border:1px solid #e2e8f0"><div style="font-size:8px;color:#94a3b8;margin-top:2px;text-align:center;font-family:monospace">'+(p.name||'').slice(0,18)+'</div></div>').join('')+'</div></div>' : '';
    return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:10px;page-break-inside:avoid">'+
      '<div style="display:flex;align-items:center;gap:8px;padding:9px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-wrap:wrap">'+
        '<span style="width:8px;height:8px;border-radius:50%;background:'+sol(pbo.couleur_tube)+';display:inline-block"></span>'+
        '<span style="font-family:monospace;font-size:12px;font-weight:700;color:#0f172a">'+pbo.reference_pbo+'</span>'+
        '<span style="font-size:10px;color:#64748b;font-family:monospace">'+(pbo.cable||'')+'</span>'+
        '<span style="font-size:10px;color:#374151;font-family:monospace">'+fibres.length+' fibres</span>'+
        (pbo.audite?'<span style="font-size:9px;font-weight:800;padding:2px 7px;border-radius:3px;background:#dcfce7;color:#15803d;border:1px solid #86efac;margin-left:auto">✓ AUDITÉ</span>':'<span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;background:#fef9c3;color:#854d0e;border:1px solid #fde047;margin-left:auto">⏳ EN ATTENTE</span>')+
      '</div>'+
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="background:#0f172a;color:#fff"><th style="padding:6px 9px;text-align:center">N°</th><th style="padding:6px 9px">Fibre PBO</th><th style="padding:6px 9px">Tube PBO</th><th style="padding:6px 9px">Module PM</th><th style="padding:6px 9px;text-align:center">Pos.</th><th style="padding:6px 9px">Réf PTO</th><th style="padding:6px 9px;text-align:center">Client</th><th style="padding:6px 9px">Conformité</th><th style="padding:6px 9px">Note</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      photosHtml+
    '</div>';
  }).join('');
  
  const html = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Rapport · '+m.ref_pm+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;background:#fff;color:#0f172a;font-size:12px;padding:18px;padding-top:60px}.toolbar{position:fixed;top:0;left:0;right:0;background:#0f172a;color:#fff;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,.1);z-index:100}.toolbar button{padding:8px 16px;background:#E2001A;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:12px}.toolbar button:hover{background:#B90015}.toolbar .info{font-size:11px;opacity:.8;font-family:monospace}@media print{.toolbar{display:none}body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:12mm;size:A4}}</style></head><body>'+
    '<div class="toolbar"><div class="info">Rapport · '+m.ref_pm+'</div><button onclick="window.print()">📄 Imprimer / Export PDF</button></div>'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;padding-bottom:12px;border-bottom:3px solid #0f172a">'+
      '<div><div style="font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#003087;margin-bottom:4px">Rapport audit · XP Fibre SFR</div><div style="font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-.5px">'+m.ref_pm+'</div><div style="font-size:11px;color:#64748b;margin-top:3px">📍 '+m.zone+' · '+m.type_audit+(tech?' · 👤 '+tech.prenom+' '+tech.nom:'')+'</div><div style="font-size:10px;color:#94a3b8;margin-top:2px">Généré le '+dateR+'</div></div>'+
      '<div style="background:#E2001A;color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:4px">SFR</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:14px">'+
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;color:#94a3b8;text-transform:uppercase">PBO</div><div style="font-size:18px;font-weight:900;color:#003087">'+pboList.length+'</div></div>'+
      '<div style="background:'+(audites===pboList.length?'#dcfce7':'#fef9c3')+';border:1px solid '+(audites===pboList.length?'#86efac':'#fde047')+';border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;text-transform:uppercase">Audités</div><div style="font-size:18px;font-weight:900;color:'+(audites===pboList.length?'#15803d':'#854d0e')+'">'+audites+'/'+pboList.length+'</div></div>'+
      '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;color:#1d4ed8;text-transform:uppercase">Avancement</div><div style="font-size:18px;font-weight:900;color:#1d4ed8">'+avPct+'%</div></div>'+
      '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;color:#94a3b8;text-transform:uppercase">Fibres</div><div style="font-size:18px;font-weight:900;color:#0f172a">'+totalF+'</div></div>'+
      '<div style="background:#dcfce7;border:1px solid #86efac;border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;color:#15803d;text-transform:uppercase">Conformes</div><div style="font-size:18px;font-weight:900;color:#15803d">'+conf+'</div></div>'+
      '<div style="background:'+(amod>0?'#fee2e2':'#f8fafc')+';border:1px solid '+(amod>0?'#fca5a5':'#e2e8f0')+';border-radius:6px;padding:8px;text-align:center"><div style="font-size:8px;text-transform:uppercase">À modifier</div><div style="font-size:18px;font-weight:900;color:'+(amod>0?'#dc2626':'#94a3b8')+'">'+amod+'</div></div>'+
    '</div>'+
    '<div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;padding-bottom:5px;border-bottom:2px solid #0f172a">Détail par PBO ('+pboList.length+')</div>'+
    pboCards+
    '</body></html>';
  const w=window.open('','_blank');
  if(!w){alert('Autorisez les pop-ups.');return;}
  w.document.write(html);w.document.close();
}

// AE Tab
function showAETab(tab,btn){document.querySelectorAll('.ae-page').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.ae-tab').forEach(b=>b.classList.remove('active'));document.getElementById('ae-'+tab)?.classList.add('active');if(btn)btn.classList.add('active');}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.getElementById('f-date').valueAsDate = new Date();

// Check existing session on page load
(async function() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    try {
      await loadCurrentUser(session.user.id);
      enterApp();
    } catch (err) {
      // Session invalid or profile not found
    }
  }
})();
</script>
</body>
</html>
