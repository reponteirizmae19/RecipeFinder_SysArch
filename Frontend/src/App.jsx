import { useState } from 'react'
import axios from 'axios'

const API_KEY = 'ebdbb2cbfc6741a89c2886af52cf5fd0'

const CATEGORIES = [
  { label: 'Breakfast',  emoji: '🍳', query: 'breakfast' },
  { label: 'Pasta',      emoji: '🍝', query: 'pasta' },
  { label: 'Salads',     emoji: '🥗', query: 'salad' },
  { label: 'Soups',      emoji: '🍜', query: 'soup' },
  { label: 'Grilled',    emoji: '🥩', query: 'grilled' },
  { label: 'Desserts',   emoji: '🍰', query: 'dessert' },
  { label: 'Vegan',      emoji: '🌱', query: 'vegan' },
  { label: 'Filipino',   emoji: '🇵🇭', query: 'filipino' },
]

const TRENDING = [
  { title: 'Chicken Adobo',        tag: 'Filipino Classic',  img: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=600&q=80', query: 'chicken adobo' },
  { title: 'Creamy Carbonara',     tag: 'Italian',           img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80', query: 'carbonara' },
  { title: 'Beef Sinigang',        tag: 'Sour Broth',        img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', query: 'beef sinigang' },
]

const STATS = [
  { value: '5,000+', label: 'Recipes' },
  { value: '120+',   label: 'Cuisines' },
  { value: '50K+',   label: 'Home Cooks' },
  { value: '4.9★',   label: 'Avg. Rating' },
]

// ─── Global Styles ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:      #faf7f2;
      --parchment:  #f3ede3;
      --warm:       #e8ddd0;
      --ink:        #1a1612;
      --charcoal:   #3d3530;
      --stone:      #7a6f66;
      --muted:      #b5a99e;
      --sage:       #5c7a5e;
      --amber:      #c4732a;
      --amber-lt:   #fdf0e4;
      --amber-dk:   #a35e20;
      --white:      #ffffff;
      --shadow-sm:  0 2px 8px rgba(26,22,18,.06);
      --shadow-md:  0 8px 32px rgba(26,22,18,.10);
      --shadow-lg:  0 20px 60px rgba(26,22,18,.16);
      --radius:     16px;
      --radius-lg:  28px;
    }

    html { scroll-behavior: smooth; }
    body { background: var(--cream); color: var(--ink); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--parchment); }
    ::-webkit-scrollbar-thumb { background: var(--warm); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
    @keyframes slideDown{ from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
    @keyframes spin     { to { transform:rotate(360deg) } }
    @keyframes heroText { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }

    /* ── NAV ── */
    .nav {
      position: sticky; top: 0; z-index: 300;
      background: rgba(250,247,242,.93);
      backdrop-filter: blur(18px) saturate(180%);
      border-bottom: 1px solid var(--warm);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 6%; height: 72px;
    }
    .nav-left { display:flex; align-items:center; gap:36px; }
    .nav-logo {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; letter-spacing:-.4px;
      color: var(--ink); white-space: nowrap; cursor: pointer;
      transition: opacity .2s;
    }
    .nav-logo:hover { opacity: .75; }
    .nav-logo span { color: var(--amber); }
    .nav-links { display:flex; gap:24px; }
    .nav-link {
      font-size: 13.5px; font-weight: 500; color: var(--stone);
      cursor: pointer; transition: color .2s; white-space: nowrap;
      padding: 4px 0; border-bottom: 2px solid transparent;
      transition: color .2s, border-color .2s;
    }
    .nav-link:hover, .nav-link.active { color: var(--ink); border-bottom-color: var(--amber); }

    .search-wrap {
      display: flex; align-items: center;
      background: var(--white); border: 1.5px solid var(--warm);
      border-radius: 50px; padding: 5px 5px 5px 22px; gap: 8px;
      transition: border-color .2s, box-shadow .2s; box-shadow: var(--shadow-sm);
    }
    .search-wrap:focus-within { border-color: var(--amber); box-shadow: 0 0 0 4px rgba(196,115,42,.10); }
    .search-input {
      border: none; background: none; outline: none;
      font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); width: 200px;
    }
    .search-input::placeholder { color: var(--muted); }
    .search-btn {
      background: var(--amber); color: var(--white); border: none; border-radius: 50px;
      padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer;
      font-family: 'DM Sans', sans-serif; letter-spacing: .3px; white-space: nowrap;
      transition: background .2s, transform .15s;
    }
    .search-btn:hover { background: var(--amber-dk); transform: scale(1.03); }
    .search-btn:active { transform: scale(.98); }
    .search-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .btn-spinner {
      display:inline-block; width:14px; height:14px;
      border:2px solid rgba(255,255,255,.4); border-top-color:#fff;
      border-radius:50%; animation: spin .7s linear infinite;
      vertical-align:middle; margin-right:6px;
    }

    /* ── HOME PAGE ── */

    /* Hero Banner */
    .home-hero {
      position: relative; min-height: 560px;
      display: flex; align-items: center;
      overflow: hidden;
      background: linear-gradient(135deg, #1a1612 0%, #2c1f14 50%, #1a1612 100%);
    }
    .home-hero-bg {
      position: absolute; inset: 0;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(196,115,42,.18) 0%, transparent 55%),
        radial-gradient(circle at 80% 20%, rgba(196,115,42,.10) 0%, transparent 45%);
    }
    .home-hero-pattern {
      position: absolute; inset: 0; opacity: .04;
      background-image: repeating-linear-gradient(
        45deg, #fff 0, #fff 1px, transparent 0, transparent 50%
      );
      background-size: 24px 24px;
    }
    .home-hero-content {
      position: relative; z-index: 2;
      max-width: 680px; padding: 80px 6%;
      animation: heroText .8s cubic-bezier(.22,.68,0,1) both;
    }
    .home-hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
      color: var(--amber); font-weight: 600;
      background: rgba(196,115,42,.15); border: 1px solid rgba(196,115,42,.3);
      padding: 6px 16px; border-radius: 50px; margin-bottom: 28px;
    }
    .home-hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(38px, 5.5vw, 68px);
      font-weight: 700; line-height: 1.1; color: #fff;
      margin-bottom: 22px;
    }
    .home-hero-title em { font-style: italic; color: var(--amber); }
    .home-hero-sub {
      font-size: 17px; color: rgba(255,255,255,.6);
      line-height: 1.75; margin-bottom: 44px; max-width: 520px;
    }
    .home-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--amber); color: #fff; border: none;
      border-radius: 14px; padding: 14px 28px;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: background .2s, transform .15s;
    }
    .btn-primary:hover { background: var(--amber-dk); transform: translateY(-2px); }
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: rgba(255,255,255,.7);
      border: 1.5px solid rgba(255,255,255,.2);
      border-radius: 14px; padding: 14px 28px;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
      cursor: pointer; transition: all .2s;
    }
    .btn-ghost:hover { border-color: rgba(255,255,255,.5); color: #fff; transform: translateY(-2px); }

    /* Floating food emoji decoration */
    .hero-deco {
      position: absolute; right: 6%; top: 50%; transform: translateY(-50%);
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      z-index: 2; opacity: .85;
    }
    .hero-deco-item {
      width: 90px; height: 90px; border-radius: 22px;
      background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      font-size: 36px;
    }
    .hero-deco-item:nth-child(1) { animation: float 3.2s ease-in-out infinite; }
    .hero-deco-item:nth-child(2) { animation: float 3.2s ease-in-out infinite .6s; }
    .hero-deco-item:nth-child(3) { animation: float 3.2s ease-in-out infinite 1.2s; }
    .hero-deco-item:nth-child(4) { animation: float 3.2s ease-in-out infinite 1.8s; }

    /* Stats bar */
    .stats-bar {
      background: var(--white);
      border-bottom: 1px solid var(--warm);
      padding: 0 6%;
      display: flex; gap: 0;
      overflow-x: auto;
    }
    .stat-item {
      display: flex; align-items: center; gap: 14px;
      padding: 22px 40px 22px 0;
      border-right: 1px solid var(--parchment);
      margin-right: 40px;
      flex-shrink: 0;
      animation: fadeUp .5s ease both;
    }
    .stat-item:last-child { border-right: none; }
    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 26px; font-weight: 700; color: var(--ink);
    }
    .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; letter-spacing: .5px; }

    /* Section layout */
    .home-section { padding: 72px 6%; }
    .home-section + .home-section { padding-top: 0; }
    .section-header { margin-bottom: 36px; }
    .section-eyebrow {
      font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
      color: var(--amber); font-weight: 600; margin-bottom: 10px;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 30px; font-weight: 700; color: var(--ink); line-height: 1.2;
    }
    .section-title em { font-style: italic; color: var(--amber); }
    .section-sub {
      font-size: 15px; color: var(--stone); margin-top: 10px; line-height: 1.65;
    }

    /* Category chips */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 14px;
    }
    .category-chip {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      background: var(--white); border: 1.5px solid var(--parchment);
      border-radius: 20px; padding: 22px 16px;
      cursor: pointer; transition: all .25s cubic-bezier(.22,.68,0,1.2);
      text-align: center;
    }
    .category-chip:hover {
      border-color: var(--amber);
      background: var(--amber-lt);
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    .category-chip-emoji { font-size: 30px; line-height: 1; }
    .category-chip-label {
      font-size: 12.5px; font-weight: 600; color: var(--charcoal);
      letter-spacing: .2px;
    }
    .category-chip:hover .category-chip-label { color: var(--amber-dk); }

    /* Trending cards */
    .trending-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .trending-card {
      position: relative; border-radius: 24px; overflow: hidden;
      height: 320px; cursor: pointer;
      transition: transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s;
    }
    .trending-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
    .trending-card img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform .55s ease;
    }
    .trending-card:hover img { transform: scale(1.07); }
    .trending-card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(20,14,8,.78) 0%, rgba(20,14,8,.1) 55%, transparent 100%);
    }
    .trending-card-body {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 24px 22px;
    }
    .trending-card-tag {
      display: inline-block;
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      background: rgba(196,115,42,.85); color: #fff;
      padding: 4px 12px; border-radius: 50px; margin-bottom: 8px;
      font-weight: 600;
    }
    .trending-card-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px; font-weight: 700; color: #fff; line-height: 1.25;
    }
    .trending-card-cta {
      display: flex; align-items: center; gap: 6px;
      margin-top: 12px; font-size: 13px; color: rgba(255,255,255,.7);
      font-weight: 500; transition: color .2s;
    }
    .trending-card:hover .trending-card-cta { color: var(--amber); }
    .trending-card-cta svg { transition: transform .2s; }
    .trending-card:hover .trending-card-cta svg { transform: translateX(4px); }

    /* Feature banner */
    .feature-banner {
      background: var(--ink); border-radius: 28px;
      padding: 56px 60px; display: flex; align-items: center;
      gap: 48px; overflow: hidden; position: relative;
    }
    .feature-banner-bg {
      position: absolute; inset: 0;
      background: radial-gradient(circle at 80% 50%, rgba(196,115,42,.12) 0%, transparent 60%);
      pointer-events: none;
    }
    .feature-banner-content { flex: 1; position: relative; z-index: 1; }
    .feature-banner-eyebrow {
      font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
      color: var(--amber); font-weight: 600; margin-bottom: 14px;
    }
    .feature-banner-title {
      font-family: 'Playfair Display', serif;
      font-size: 32px; font-weight: 700; color: #fff; line-height: 1.2;
      margin-bottom: 16px;
    }
    .feature-banner-sub { font-size: 15px; color: rgba(255,255,255,.55); line-height: 1.7; }
    .feature-banner-emoji {
      font-size: 80px; flex-shrink: 0;
      animation: float 3s ease-in-out infinite;
      position: relative; z-index: 1;
    }
    .feature-banner-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--amber); color: #fff; border: none;
      border-radius: 14px; padding: 13px 26px;
      font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: background .2s, transform .15s;
      margin-top: 28px;
    }
    .feature-banner-btn:hover { background: var(--amber-dk); transform: translateY(-2px); }

    /* ── RESULTS ── */
    .results-header {
      padding: 40px 6% 20px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid var(--warm);
      animation: slideDown .4s ease both;
    }
    .results-header-left { display:flex; align-items:center; gap:16px; }
    .back-btn {
      display: flex; align-items: center; gap: 6px;
      background: var(--parchment); border: none; border-radius: 10px;
      padding: 8px 14px; font-size: 13px; font-weight: 600;
      color: var(--charcoal); cursor: pointer; transition: all .2s;
      font-family: 'DM Sans', sans-serif;
    }
    .back-btn:hover { background: var(--warm); }
    .results-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px; font-weight: 600; color: var(--ink);
    }
    .results-title span { font-style: italic; color: var(--amber); }
    .results-count { font-size: 13px; color: var(--muted); font-weight: 500; }

    /* Cards grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 28px; padding: 36px 6% 80px;
    }
    .card {
      background: var(--white); border-radius: var(--radius-lg);
      overflow: hidden; box-shadow: var(--shadow-sm);
      border: 1px solid var(--parchment);
      transition: transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s;
      cursor: pointer; display: flex; flex-direction: column;
    }
    .card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
    .card-img-wrap { position: relative; height: 210px; overflow: hidden; }
    .card-img-wrap img { width:100%; height:100%; object-fit:cover; transition: transform .5s ease; }
    .card:hover .card-img-wrap img { transform: scale(1.06); }
    .card-img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(26,22,18,.18) 0%, transparent 60%);
    }
    .card-body { padding: 22px 24px 24px; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 17px; font-weight: 600; color: var(--ink);
      line-height: 1.35; margin-bottom: 18px;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .view-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 11px 20px; background: transparent;
      border: 1.5px solid var(--warm); border-radius: 12px;
      color: var(--charcoal); font-size: 13px; font-weight: 600;
      font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
    }
    .view-btn:hover { background: var(--amber); border-color: var(--amber); color: var(--white); }
    .view-btn svg { transition: transform .2s; }
    .view-btn:hover svg { transform: translateX(3px); }

    /* ── MODAL ── */
    .overlay {
      position: fixed; inset: 0; z-index: 500;
      background: rgba(26,22,18,.55);
      backdrop-filter: blur(10px) saturate(140%);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: fadeIn .25s ease both;
    }
    .modal {
      background: var(--white); width: 100%; max-width: 660px; max-height: 88vh;
      border-radius: 28px; overflow: hidden;
      box-shadow: 0 40px 80px rgba(26,22,18,.25);
      display: flex; flex-direction: column;
      animation: fadeUp .35s cubic-bezier(.22,.68,0,1.2) both;
    }
    .modal-header {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
      padding: 28px 32px 22px; border-bottom: 1px solid var(--parchment);
      position: sticky; top: 0; background: var(--white); z-index: 10;
    }
    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px; font-weight: 700; color: var(--ink); line-height: 1.3;
    }
    .modal-close {
      flex-shrink: 0; width: 36px; height: 36px;
      background: var(--parchment); border: none; border-radius: 50%;
      cursor: pointer; font-size: 18px; color: var(--stone);
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, color .2s;
    }
    .modal-close:hover { background: var(--amber); color: var(--white); }
    .modal-body { overflow-y: auto; padding: 28px 32px 36px; }
    .modal-img { width:100%; height:260px; object-fit:cover; border-radius:18px; margin-bottom:24px; }
    .modal-badges { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:28px; }
    .badge {
      display: flex; align-items: center; gap: 6px;
      background: var(--parchment); padding: 8px 16px; border-radius: 10px;
      font-size: 13px; font-weight: 600; color: var(--charcoal);
    }
    .badge-icon { font-size: 15px; }
    .modal-section-title {
      font-family: 'Playfair Display', serif;
      font-size: 18px; font-weight: 700; color: var(--ink);
      margin: 28px 0 14px;
      padding-bottom: 10px; border-bottom: 2px solid var(--parchment);
      display: flex; align-items: center; gap: 10px;
    }
    .modal-section-title::before {
      content:''; display:inline-block; width:4px; height:20px;
      border-radius:2px; background: var(--amber);
    }
    .ingredients-list { list-style:none; display:flex; flex-direction:column; gap:8px; }
    .ingredients-list li {
      display: flex; align-items: center; gap: 10px;
      font-size: 14px; color: var(--charcoal); line-height: 1.5;
      padding: 8px 12px; border-radius: 10px; transition: background .15s;
    }
    .ingredients-list li:hover { background: var(--parchment); }
    .ing-dot { flex-shrink:0; width:6px; height:6px; border-radius:50%; background:var(--amber); }
    .instructions { font-size: 14.5px; line-height: 1.85; color: var(--charcoal); }
    .instructions p { margin-bottom: 14px; }
    .instructions ol, .instructions ul { padding-left: 20px; }
    .instructions li { margin-bottom: 10px; }
    .loading-center {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:80px 32px; gap:16px;
    }
    .loader {
      width:36px; height:36px;
      border:3px solid var(--warm); border-top-color:var(--amber);
      border-radius:50%; animation: spin .8s linear infinite;
    }
    .loader-text { font-size:14px; color:var(--muted); font-family:'Playfair Display',serif; font-style:italic; }

    /* fade-up stagger for cards */
    .fade-up { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) both; }
    .fade-up:nth-child(1){animation-delay:.05s} .fade-up:nth-child(2){animation-delay:.12s}
    .fade-up:nth-child(3){animation-delay:.19s} .fade-up:nth-child(4){animation-delay:.26s}
    .fade-up:nth-child(5){animation-delay:.33s} .fade-up:nth-child(6){animation-delay:.40s}
    .fade-up:nth-child(7){animation-delay:.47s} .fade-up:nth-child(8){animation-delay:.54s}
    .fade-up:nth-child(9){animation-delay:.61s}

    /* ── FOOTER ── */
    .footer {
      background: var(--ink); color: var(--stone);
      padding: 60px 6% 32px; border-top: 1px solid rgba(255,255,255,.06);
    }
    .footer-top {
      display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
      gap: 48px; margin-bottom: 52px;
    }
    .footer-brand {
      font-family:'Playfair Display',serif; font-size:20px; font-weight:700;
      color:var(--white); margin-bottom:12px;
    }
    .footer-brand span { color: var(--amber); }
    .footer-desc { font-size:13.5px; line-height:1.75; color:#6b6058; }
    .footer-col-title {
      font-size:10.5px; letter-spacing:2.5px; text-transform:uppercase;
      color:var(--muted); font-weight:600; margin-bottom:18px;
    }
    .footer-link {
      display:block; font-size:13.5px; color:#6b6058;
      margin-bottom:10px; cursor:pointer; transition:color .2s;
    }
    .footer-link:hover { color: var(--amber); }
    .footer-bottom {
      border-top:1px solid rgba(255,255,255,.06); padding-top:24px;
      display:flex; align-items:center; justify-content:space-between;
      flex-wrap:wrap; gap:12px;
    }
    .footer-copy { font-size:12.5px; color:#3d3530; }
    .footer-copy strong { color:#5a4f47; }
    .footer-status { display:flex; align-items:center; gap:7px; font-size:12px; color:#3d3530; }
    .status-dot { width:7px; height:7px; border-radius:50%; background:var(--sage); box-shadow:0 0 0 3px rgba(92,122,94,.25); }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .hero-deco { display:none; }
      .feature-banner { flex-direction:column; padding:40px 32px; gap:24px; }
      .feature-banner-emoji { font-size:56px; }
      .footer-top { grid-template-columns:1fr 1fr; gap:32px; }
    }
    @media (max-width: 640px) {
      .nav { padding:0 4%; }
      .nav-links { display:none; }
      .search-input { width:130px; }
      .home-section { padding:48px 4%; }
      .grid { padding:24px 4% 60px; gap:20px; }
      .modal-header { padding:22px 22px 18px; }
      .modal-body { padding:22px 22px 28px; }
      .stats-bar { padding:0 4%; }
      .results-header { padding:24px 4% 16px; }
    }
  `}</style>
)

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')   // 'home' | 'results'
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeDetails, setRecipeDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchedQuery, setSearchedQuery] = useState('')

  const searchRecipes = async (q) => {
    const term = (q || query).trim()
    if (!term) return
    setLoading(true)
    setSearchedQuery(term)
    if (q) setQuery(q)
    try {
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${term}&apiKey=${API_KEY}&number=9`
      )
      setRecipes(res.data.results)
      setPage('results')
    } catch {
      alert('Something went wrong. Please check your connection.')
    }
    setLoading(false)
  }

  const fetchRecipeDetails = async (id) => {
    setDetailsLoading(true)
    setSelectedRecipe(id)
    setRecipeDetails(null)
    try {
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      )
      setRecipeDetails(res.data)
    } catch {
      alert('Error fetching recipe details.')
    }
    setDetailsLoading(false)
  }

  const closeModal = () => { setSelectedRecipe(null); setRecipeDetails(null) }
  const goHome = () => { setPage('home'); setRecipes([]); setQuery('') }

  return (
    <>
      <GlobalStyles />

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-logo" onClick={goHome}>M <span>&</span> M's</div>
          <div className="nav-links">
            <span className={`nav-link ${page==='home'?'active':''}`} onClick={goHome}>Home</span>
            <span className="nav-link" onClick={() => searchRecipes('popular recipes')}>Explore</span>
            <span className="nav-link" onClick={() => searchRecipes('filipino')}>Filipino</span>
            <span className="nav-link" onClick={() => searchRecipes('quick meals')}>Quick Meals</span>
          </div>
        </div>
        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Search any recipe…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchRecipes()}
          />
          <button className="search-btn" onClick={() => searchRecipes()} disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </nav>

      {/* ── HOME PAGE ── */}
      {page === 'home' && (
        <main>
          {/* Hero */}
          <section className="home-hero">
            <div className="home-hero-bg" />
            <div className="home-hero-pattern" />
            <div className="home-hero-content">
              <div className="home-hero-eyebrow">
                🍴 M & M's Recipe Collection
              </div>
              <h1 className="home-hero-title">
                Cook with<br /><em>confidence</em>,<br />eat with joy.
              </h1>
              <p className="home-hero-sub">
                Thousands of professional recipes at your fingertips — from quick weeknight dinners to weekend feasts.
              </p>
              <div className="home-hero-actions">
                <button className="btn-primary" onClick={() => searchRecipes('popular recipes')}>
                  Explore Recipes
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="btn-ghost" onClick={() => searchRecipes('filipino')}>
                  🇵🇭 Filipino Recipes
                </button>
              </div>
            </div>
            <div className="hero-deco">
              <div className="hero-deco-item">🍲</div>
              <div className="hero-deco-item">🥗</div>
              <div className="hero-deco-item">🍝</div>
              <div className="hero-deco-item">🥩</div>
            </div>
          </section>

          {/* Stats */}
          <div className="stats-bar">
            {STATS.map((s, i) => (
              <div className="stat-item" key={i} style={{animationDelay:`${i*.1}s`}}>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <section className="home-section">
            <div className="section-header">
              <div className="section-eyebrow">Browse by type</div>
              <h2 className="section-title">What are you <em>craving?</em></h2>
              <p className="section-sub">Pick a category and we'll find the perfect dish for you.</p>
            </div>
            <div className="categories-grid">
              {CATEGORIES.map((c, i) => (
                <div
                  className="category-chip fade-up"
                  key={c.label}
                  style={{animationDelay:`${i*.07}s`}}
                  onClick={() => searchRecipes(c.query)}
                >
                  <div className="category-chip-emoji">{c.emoji}</div>
                  <div className="category-chip-label">{c.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending */}
          <section className="home-section" style={{paddingTop:0}}>
            <div className="section-header">
              <div className="section-eyebrow">Handpicked for you</div>
              <h2 className="section-title"><em>Trending</em> this week</h2>
            </div>
            <div className="trending-grid">
              {TRENDING.map((t, i) => (
                <div
                  className="trending-card fade-up"
                  key={t.title}
                  style={{animationDelay:`${i*.12}s`}}
                  onClick={() => searchRecipes(t.query)}
                >
                  <img src={t.img} alt={t.title} />
                  <div className="trending-card-overlay" />
                  <div className="trending-card-body">
                    <div className="trending-card-tag">{t.tag}</div>
                    <div className="trending-card-title">{t.title}</div>
                    <div className="trending-card-cta">
                      Find recipes
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Banner */}
          <section className="home-section" style={{paddingTop:0}}>
            <div className="feature-banner">
              <div className="feature-banner-bg" />
              <div className="feature-banner-content">
                <div className="feature-banner-eyebrow">Pro Tip</div>
                <h3 className="feature-banner-title">
                  Search by ingredient,<br />not just dish name
                </h3>
                <p className="feature-banner-sub">
                  Have leftover chicken and veggies? Type any ingredient and we'll show you what you can cook with what you have.
                </p>
                <button
                  className="feature-banner-btn"
                  onClick={() => searchRecipes('chicken vegetables easy')}
                >
                  Try it now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="feature-banner-emoji">🧑‍🍳</div>
            </div>
          </section>
        </main>
      )}

      {/* ── RESULTS PAGE ── */}
      {page === 'results' && (
        <main style={{ minHeight: 'calc(100vh - 72px - 280px)' }}>
          <div className="results-header">
            <div className="results-header-left">
              <button className="back-btn" onClick={goHome}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M12 7H2M7 12L2 7l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Home
              </button>
              <h2 className="results-title">
                Results for <span>"{searchedQuery}"</span>
              </h2>
            </div>
            <span className="results-count">{recipes.length} recipes found</span>
          </div>
          <div className="grid">
            {recipes.map(r => (
              <div key={r.id} className="card fade-up">
                <div className="card-img-wrap">
                  <img src={r.image} alt={r.title} />
                  <div className="card-img-overlay" />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{r.title}</h3>
                  <button className="view-btn" onClick={() => fetchRecipeDetails(r.id)}>
                    View Recipe
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand">M <span>&</span> M's</div>
            <p className="footer-desc">Your trusted destination for discovering professional-grade recipes from around the world, curated for everyday cooking.</p>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            {['Privacy Notice','Cookie Policy','Terms of Service','Accessibility'].map(t=>(
              <a key={t} className="footer-link">{t}</a>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Follow</div>
            {['Facebook','Instagram','X (Twitter)','GitHub'].map(t=>(
              <a key={t} className="footer-link">{t}</a>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Office</div>
            <a className="footer-link">Cebu City, Philippines</a>
            <a className="footer-link">System Architecture Project</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 <strong>M & M's Philippines</strong> — All rights reserved.</p>
          <div className="footer-status">
            <div className="status-dot" />
            <span>All systems operational</span>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {selectedRecipe && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {detailsLoading || !recipeDetails ? (
              <div className="loading-center">
                <div className="loader" />
                <p className="loader-text">Preparing your recipe…</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2 className="modal-title">{recipeDetails.title}</h2>
                  <button className="modal-close" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                  <img className="modal-img" src={recipeDetails.image} alt={recipeDetails.title} />
                  <div className="modal-badges">
                    <div className="badge"><span className="badge-icon">⏱</span>{recipeDetails.readyInMinutes} minutes</div>
                    <div className="badge"><span className="badge-icon">🍽</span>{recipeDetails.servings} servings</div>
                    {recipeDetails.vegan && <div className="badge"><span className="badge-icon">🌱</span>Vegan</div>}
                    {recipeDetails.glutenFree && <div className="badge"><span className="badge-icon">🌾</span>Gluten Free</div>}
                  </div>
                  <div className="modal-section-title">Ingredients</div>
                  <ul className="ingredients-list">
                    {recipeDetails.extendedIngredients.map((ing, i) => (
                      <li key={i}><div className="ing-dot" />{ing.original}</li>
                    ))}
                  </ul>
                  <div className="modal-section-title">Instructions</div>
                  <div className="instructions" dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}