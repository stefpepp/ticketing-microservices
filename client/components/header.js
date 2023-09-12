import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Signup", href: "/auth/signup" },
    !currentUser && { label: "Signin", href: "/auth/signin" },
    currentUser && { label: "Sell tickets", href: "/tickets/new" },
    currentUser && { label: "My orders", href: "/orders" },
    currentUser && { label: "Signout", href: "/auth/signout" },
  ]
    .filter((linksConf) => linksConf)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
