import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreMoreModal from '../components/ExploreMoreModal';

const mockServices = [
    { id: 1, name: 'Electrician', icon: '⚡' },
    { id: 2, name: 'Plumber', icon: '🔧' },
    { id: 3, name: 'AC Repair', icon: '❄️' },
    { id: 4, name: 'Carpenter', icon: '🔨' },
    { id: 5, name: 'House Cleaning', icon: '🧹' },
    { id: 6, name: 'Appliance Repair', icon: '📺' },
];

const Services = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleServiceClick = (serviceName) => {
        // Navigate to /providers?service=name
        // URL encode the service name to handle spaces properly
        navigate(`/providers?service=${encodeURIComponent(serviceName)}`);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Our Services</h1>
            <p style={styles.subtitle}>Choose a service below to find the best providers for your needs.</p>

            <div style={styles.grid}>
                {mockServices.map((service) => (
                    <div
                        key={service.id}
                        style={styles.card}
                        onClick={() => handleServiceClick(service.name)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = styles.cardHover.transform;
                            e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                            e.currentTarget.style.borderColor = styles.cardHover.borderColor;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = styles.card.boxShadow;
                            e.currentTarget.style.borderColor = styles.card.borderColor;
                        }}
                    >
                        <div style={styles.icon}>{service.icon}</div>
                        <h3 style={styles.serviceName}>{service.name}</h3>
                    </div>
                ))}
            </div>

            <div style={styles.exploreContainer}>
                <button
                    style={styles.exploreBtn}
                    onClick={() => setIsModalOpen(true)}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.exploreBtnHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.exploreBtn.backgroundColor}
                >
                    Explore More Services
                </button>
            </div>

            <ExploreMoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Inter, Roboto, sans-serif',
    },
    title: {
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: '#1f2937',
        fontSize: '2.5rem',
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#6b7280',
        fontSize: '1.1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    },
    cardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: '#3b82f6', // subtle blue border on hover
    },
    icon: {
        fontSize: '3.5rem',
        marginBottom: '1.5rem',
        display: 'inline-block',
    },
    serviceName: {
        margin: 0,
        color: '#111827',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    exploreContainer: {
        marginTop: '3.5rem',
        textAlign: 'center',
    },
    exploreBtn: {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        border: 'none',
        padding: '1rem 2.5rem',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    exploreBtnHover: {
        backgroundColor: '#111827',
    }
};

export default Services;
