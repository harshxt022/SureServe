import React from 'react';
import { Link } from 'react-router-dom'; // Using react-router-dom for placeholder navigation

const Navbar = () => {
    return (
        <nav className="navbar" style={styles.navbar}>
            <div className="navbar-brand">
                <Link to="/" style={styles.brand}>SureServe</Link>
            </div>
            <ul className="navbar-nav" style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Home</Link></li>
                <li><Link to="/services" style={styles.link}>Services</Link></li>
                <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
                <li><Link to="/login" style={styles.link}>Login</Link></li>
                <li>
                    <button
                        onClick={() => console.log('Logout clicked - Backend not connected')}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

// Basic inline styles to structure the Navbar placeholders
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#333',
        color: '#fff',
    },
    brand: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyleType: 'none',
        display: 'flex',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
        alignItems: 'center',
    },
    link: {
        color: '#ddd',
        textDecoration: 'none',
        fontSize: '1rem',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        color: '#ddd',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderRadius: '4px',
    }
};

export default Navbar;
