import '../styles/SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Pie de pagina principal">
      <div className="site-footer-inner">
        <section className="site-footer-brand" aria-label="Informacion de PokeSPA">
          <div className="site-footer-logo" aria-hidden="true">
            <span className="site-footer-logo-dot"></span>
          </div>

          <div className="site-footer-brand-copy">
            <h2 className="site-footer-title">PokeSPA</h2>
            <p className="site-footer-description">
              Domina el arte de la batalla. La base de datos mas completa con estadisticas,
              estrategias y secretos de cada Pokemon descubierto alrededor del mundo.
            </p>
          </div>
        </section>

        <nav className="site-footer-nav" aria-label="Accesos de la pokedex">
          <p className="site-footer-nav-title">POKEDEX</p>

          <ul className="site-footer-nav-list">
            <li>Por generacion</li>
            <li>Por tipo</li>
            <li>Shiny</li>
          </ul>
        </nav>
      </div>

      <p className="site-footer-copyright">
        © 2026 PokePedia. Todos los derechos reservados. Data provided by PokeAPI.
      </p>
    </footer>
  );
}