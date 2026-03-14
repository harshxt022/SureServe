import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout wrapper component for all public/private pages.
 * Ensures the Navbar is always at the top and Footer at the bottom.
 */
const Layout = ({ children }) => {
    return (
        <div className="app-layout" style={styles.layoutWrapper}>
            <Navbar />
            <main className="main-content" style={styles.mainContent}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

const styles = {
    layoutWrapper: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    mainContent: {
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f9f9f9',
    }
};

export default Layout;
