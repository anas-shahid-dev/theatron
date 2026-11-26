import os

base = r"d:\Uni\iict\THEATRON-MEMBER-4"

# 1. THEATRON Brand Logo
logo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1BD72"/>
      <stop offset="50%" stop-color="#E6B96F"/>
      <stop offset="100%" stop-color="#9E7638"/>
    </linearGradient>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2B0C14"/>
      <stop offset="100%" stop-color="#0F0508"/>
    </radialGradient>
  </defs>
  <rect x="5" y="5" width="90" height="90" rx="18" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="2.5"/>
  <rect x="10" y="10" width="80" height="80" rx="14" fill="none" stroke="url(#goldGrad)" stroke-width="0.75" stroke-opacity="0.4"/>
  <text x="50" y="68" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" font-size="54" font-weight="700" fill="url(#goldGrad)">T</text>
</svg>"""

with open(os.path.join(base, "assets", "logos", "theatron-logo.svg"), "w", encoding="utf-8") as f:
    f.write(logo_svg)

# 2. Luxury Avatar
avatar_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="avGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B101E"/>
      <stop offset="60%" stop-color="#22080F"/>
      <stop offset="100%" stop-color="#0C0508"/>
    </linearGradient>
    <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1BD72"/>
      <stop offset="50%" stop-color="#E6B96F"/>
      <stop offset="100%" stop-color="#8C6326"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#avGrad)" stroke="url(#goldRing)" stroke-width="3"/>
  <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldRing)" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
  <!-- Stylized VIP Connoisseur Silhouette -->
  <circle cx="100" cy="74" r="32" fill="#E6B96F" opacity="0.95"/>
  <path d="M46 166 C52 118, 76 114, 100 114 C124 114, 148 118, 154 166 Z" fill="#E6B96F" opacity="0.9"/>
  <!-- Gold bowtie / lapel accent -->
  <polygon points="100,122 88,114 112,114" fill="#F1BD72"/>
  <circle cx="100" cy="116" r="3" fill="#3A0D18"/>
</svg>"""

with open(os.path.join(base, "assets", "images", "luxury-avatar.svg"), "w", encoding="utf-8") as f:
    f.write(avatar_svg)

# Helper function to generate cinema location visuals
def create_cinema_card_svg(filename, title, subtitle, accent_color, motif_path):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A0B13"/>
      <stop offset="40%" stop-color="#14060A"/>
      <stop offset="100%" stop-color="#080305"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="{accent_color}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1BD72"/>
      <stop offset="100%" stop-color="#C5A059"/>
    </linearGradient>
    <pattern id="luxPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#E6B96F" stroke-width="0.4" stroke-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <rect width="800" height="500" fill="url(#luxPattern)"/>
  <rect width="800" height="500" fill="url(#glow)"/>
  <!-- Architectural silhouette / Screen perspective -->
  <g transform="translate(100, 60)">
    <!-- Cinema Screen Curve -->
    <path d="M 50 40 Q 300 15 550 40 L 580 230 Q 300 250 20 230 Z" fill="#0D0609" stroke="#E6B96F" stroke-width="1.8" opacity="0.95"/>
    <path d="M 70 55 Q 300 35 530 55 L 555 215 Q 300 230 45 215 Z" fill="{accent_color}" fill-opacity="0.25"/>
    <text x="300" y="145" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', serif" font-size="28" font-weight="700" fill="#F1BD72" letter-spacing="4">{title.upper()}</text>
    <text x="300" y="175" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="13" font-weight="500" fill="#E6B96F" letter-spacing="6">EXCLUSIVE DESTINATION</text>
    <!-- Screen Beam Projection -->
    <polygon points="300, -20 70, 55 530, 55" fill="#E6B96F" opacity="0.08"/>
  </g>
  <!-- Recliner Seating Rows in Foreground -->
  <g fill="#1F080F" stroke="#E6B96F" stroke-width="0.8" opacity="0.9">
    <rect x="120" y="320" width="100" height="40" rx="8"/>
    <rect x="250" y="320" width="100" height="40" rx="8"/>
    <rect x="450" y="320" width="100" height="40" rx="8"/>
    <rect x="580" y="320" width="100" height="40" rx="8"/>
    <rect x="80" y="380" width="120" height="50" rx="10"/>
    <rect x="230" y="380" width="120" height="50" rx="10"/>
    <rect x="450" y="380" width="120" height="50" rx="10"/>
    <rect x="600" y="380" width="120" height="50" rx="10"/>
  </g>
  <!-- Subtle aisle lighting -->
  <line x1="380" y1="310" x2="420" y2="480" stroke="#F1BD72" stroke-width="2" opacity="0.4" stroke-dasharray="4 6"/>
  <!-- Overlay vignette and frame -->
  <rect x="12" y="12" width="776" height="476" rx="12" fill="none" stroke="#E6B96F" stroke-width="1" stroke-opacity="0.3"/>
  <text x="40" y="460" font-family="'Montserrat', sans-serif" font-size="14" font-weight="600" fill="#F5EFE8" letter-spacing="2">{subtitle.upper()}</text>
  <text x="760" y="460" text-anchor="end" font-family="'Montserrat', sans-serif" font-size="12" font-weight="500" fill="#E6B96F" letter-spacing="1.5">THEATRON SIGNATURE SANCTUARY</text>
</svg>"""
    with open(os.path.join(base, "assets", "images", filename), "w", encoding="utf-8") as f:
        f.write(svg)

create_cinema_card_svg("flagship-cinema.svg", "Theatron Grand Flagship", "88 Sovereign Boulevard • 8 Premium Halls", "#4B101E", "")
create_cinema_card_svg("elysium-palace.svg", "Theatron Elysium Palace", "420 Monarch Avenue • 6 Velvet Suites", "#5A1325", "")
create_cinema_card_svg("celestial-pavilion.svg", "Theatron Celestial Pavilion", "15 Aurora Crest Drive • 10 Grand Auditoriums", "#36101B", "")
create_cinema_card_svg("astral-sanctuary.svg", "Theatron Astral Sanctuary", "77 Marina Promenade • 5 Panoramic ScreenX Pods", "#42121E", "")

# 3. Posters from Reference Screenshot
def create_movie_poster(filename, title, genre, rating, lang, color_accent):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="posterBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E070F"/>
      <stop offset="50%" stop-color="{color_accent}"/>
      <stop offset="100%" stop-color="#080305"/>
    </linearGradient>
    <radialGradient id="celestialLight" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#F1BD72" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="{color_accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="800" fill="url(#posterBg)"/>
  <circle cx="300" cy="280" r="220" fill="url(#celestialLight)"/>
  <!-- Decorative cinematic geometry -->
  <circle cx="300" cy="280" r="160" fill="none" stroke="#E6B96F" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="300" cy="280" r="200" fill="none" stroke="#E6B96F" stroke-width="0.5" stroke-dasharray="6 6" stroke-opacity="0.4"/>
  <polygon points="300,120 440,360 160,360" fill="none" stroke="#E6B96F" stroke-width="1" stroke-opacity="0.25"/>
  <circle cx="300" cy="280" r="40" fill="#F1BD72" opacity="0.8"/>
  
  <!-- Subtle dark vignette at bottom -->
  <rect y="400" width="600" height="400" fill="black" opacity="0.6"/>

  <!-- Badges at top -->
  <g transform="translate(30, 30)">
    <rect width="70" height="28" rx="14" fill="rgba(18,9,12,0.8)" stroke="#E6B96F" stroke-width="0.8"/>
    <text x="35" y="19" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#F5EFE8">PG-13</text>
  </g>
  <g transform="translate(110, 30)">
    <rect width="80" height="28" rx="14" fill="rgba(18,9,12,0.8)" stroke="#E6B96F" stroke-width="0.8"/>
    <text x="40" y="19" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#F5EFE8">{lang}</text>
  </g>
  <g transform="translate(490, 30)">
    <rect width="80" height="28" rx="14" fill="rgba(18,9,12,0.9)" stroke="#E6B96F" stroke-width="0.8"/>
    <text x="40" y="19" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#F1BD72">★ {rating}</text>
  </g>

  <!-- Title & Info -->
  <text x="300" y="660" text-anchor="middle" font-family="'Cinzel', 'Playfair Display', serif" font-size="32" font-weight="700" fill="#F5EFE8" letter-spacing="2">{title.upper()}</text>
  <text x="300" y="700" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="600" fill="#E6B96F" letter-spacing="4">{genre.upper()}</text>
  <text x="300" y="740" text-anchor="middle" font-family="'Cinzel', serif" font-size="12" fill="#B9A9A8" letter-spacing="6">THEATRON EXCLUSIVE 4K HDR</text>
</svg>"""
    with open(os.path.join(base, "assets", "images", filename), "w", encoding="utf-8") as f:
        f.write(svg)

create_movie_poster("doomsday-poster.svg", "Doomsday: Eclipse Protocol", "Sci-Fi Thriller • 2H 28M", "9.4", "English", "#2A1838")
create_movie_poster("mirage-poster.svg", "Mirage of Kings", "Action • 2H 11M", "8.9", "Arabic", "#3A141A")
create_movie_poster("symphony-poster.svg", "Symphony for Zero", "Mystery • 2H 04M", "8.6", "English", "#1A2535")

# 4. Offers Visuals
def create_offer_card_svg(filename, headline, tag, icon_type):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400" width="700" height="400">
  <defs>
    <linearGradient id="oBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3D0C17"/>
      <stop offset="50%" stop-color="#1A070B"/>
      <stop offset="100%" stop-color="#0A0406"/>
    </linearGradient>
    <radialGradient id="oGlow" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#E6B96F" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="700" height="400" fill="url(#oBg)"/>
  <rect width="700" height="400" fill="url(#oGlow)"/>
  <rect x="15" y="15" width="670" height="370" rx="16" fill="none" stroke="#E6B96F" stroke-width="1" stroke-opacity="0.35"/>
  <!-- Decorative Luxury Art -->
  <circle cx="530" cy="200" r="130" fill="none" stroke="#E6B96F" stroke-width="1" stroke-opacity="0.25"/>
  <circle cx="530" cy="200" r="90" fill="none" stroke="#E6B96F" stroke-width="0.5" stroke-dasharray="4 4" stroke-opacity="0.4"/>
  <polygon points="530,110 610,240 450,240" fill="none" stroke="#F1BD72" stroke-width="1.2" stroke-opacity="0.3"/>
  <circle cx="530" cy="200" r="24" fill="#F1BD72" opacity="0.85"/>
  
  <text x="60" y="110" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" fill="#E6B96F" letter-spacing="4">{tag.upper()}</text>
  <text x="60" y="170" font-family="'Cinzel', 'Playfair Display', serif" font-size="34" font-weight="700" fill="#F5EFE8">{headline.upper()}</text>
  <text x="60" y="215" font-family="'Montserrat', sans-serif" font-size="15" font-weight="400" fill="#B9A9A8">Complimentary service &amp; tailored VIP hospitality.</text>
  <text x="60" y="320" font-family="'Cinzel', serif" font-size="14" font-weight="600" fill="#E6B96F" letter-spacing="2">THEATRON CONNOISSEUR PRIVILEGE</text>
</svg>"""
    with open(os.path.join(base, "assets", "images", filename), "w", encoding="utf-8") as f:
        f.write(svg)

create_offer_card_svg("offer-truffle.svg", "Private Lounge Privilege", "Culinary Excellence", "champagne")
create_offer_card_svg("offer-weekday.svg", "Midweek Matinee Royale", "Screening Privilege", "film")
create_offer_card_svg("offer-duo.svg", "The Sovereign Pair", "Two-Person Experience", "users")
create_offer_card_svg("offer-lounge.svg", "Royal Velvet Sanctuary", "Exclusive Access", "award")
create_offer_card_svg("offer-premiere.svg", "Gala Red Carpet Access", "Special Events", "star")
create_offer_card_svg("offer-snack.svg", "Artisan Concessions", "Gastronomy Pairings", "coffee")

print("All SVG assets successfully written!")
