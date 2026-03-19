import '../styles/SiteFooter.css'

export function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="site-footer__top">
                {/* Brand */}
                <div className="site-footer__brand-col">
                    <div className="site-footer__logo-row">
                        <div className="site-footer__logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                                <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" />
                                <circle cx="12" cy="12" r="3" fill="white" />
                            </svg>
                        </div>
                        <span className="site-footer__brand-name">PokeSPA</span>
                    </div>
                    <p className="site-footer__desc">
                        Domina el arte de la batalla. La base de datos más completa con estadísticas,
                        estrategias y secretos de cada Pokémon descubierto alrededor del mundo.
                    </p>
                </div>

                {/* Nav Column */}
                <div className="site-footer__nav-col">
                    <h4 className="site-footer__nav-title">POKEDEX</h4>
                    <ul className="site-footer__nav-list">
                        <li><a href="#" className="site-footer__nav-link">Por generación</a></li>
                        <li><a href="#" className="site-footer__nav-link">Por tipo</a></li>
                        <li><a href="#" className="site-footer__nav-link">Shiny</a></li>
                    </ul>
                </div>
            </div>

            <div className="site-footer__bottom">
                <p className="site-footer__copy">
                    © 2024 PokePedia. Todos los derechos reservados. Data provided by PokeAPI.
                </p>
            </div>
        </footer>
    )
}
