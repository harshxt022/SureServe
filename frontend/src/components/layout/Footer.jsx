import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer" style={styles.footer}>
            <div className="footer-content" style={styles.content}>
                <div style={styles.section}>
                    <h3>SureServe</h3>
                    <p>Your simple service marketplace.</p>
                </div>
                <div style={styles.section}>
                    <h4>Links</h4>
                    <ul style={styles.list}>
                        <li><Link to="/" style={styles.link}>Home</Link></li>
                        <li><Link to="/services" style={styles.link}>Services</Link></li>
                        <li><Link to="/about" style={styles.link}>About Us</Link></li>
                        <li><Link to="/contact" style={styles.link}>Contact</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom" style={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} SureServe. All rights reserved.</p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#222',
        color: '#ccc',
        padding: '2rem 2rem 1rem 2rem',
        marginTop: 'auto',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: '2rem',
    },
    section: {
        flex: '1',
        minWidth: '200px',
        marginBottom: '1rem',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    link: {
        color: '#aaa',
        textDecoration: 'none',
    },
    bottom: {
        borderTop: '1px solid #444',
        paddingTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
    }
};

export default Footer;
