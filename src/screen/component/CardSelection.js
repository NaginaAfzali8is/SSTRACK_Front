import axios from "axios";
import React from "react";

const CardSelection = ({ cards, selectedCard, onSelect, onActionComplete }) => {

    const handleSetDefaultCard = async (cards) => {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };
        console.log('default card set', cards);
        const DefaultPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";
        try {
            const response = await axios.post(`${DefaultPayApiUrl}/owner/setDefaultCard 	`, {
                cardNumber: cards.cardNumber,
                cardType: cards.cardType,
            }, { headers });

            if (response.data.success) {
                console.log('Default card set successfully:', response);
                onActionComplete();
            } else {
                console.error('Failed to set default card:', response.data.error);

            }
        } catch (error) {
            console.error('Error:', error);

        }
    };


    const handleDeleteCard = async (card) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }

        const headers = {
            Authorization: "Bearer " + token,
        };
        console.log('delete card', card);
        console.log('delete header', headers);

        const DefaultPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";
        try {
            const response = await axios.request({
                url: `${DefaultPayApiUrl}/owner/deleteCard`,
                method: 'delete',
                headers: headers,
                data: {
                    cardNumber: card.cardNumber,
                    cardType: card.cardType,
                }
            });

            if (response.data.success) {
                console.log('Card deleted successfully:', response);
                onActionComplete();
            } else {
                console.error('Failed to delete card:', response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Select a Card</h3>
            <div style={styles.cardContainer}>
                {cards.map((card) => (
                    <div
                        key={card._id}
                        style={{
                            ...styles.card,
                            ...(selectedCard === card._id ? styles.selectedCard : {}),
                        }}
                    >
                        <input
                            id={card._id}
                            type="radio"
                            name="selectedCard"
                            value={card._id}
                            checked={selectedCard === card._id}
                            onChange={() => onSelect(card)}
                            style={styles.radio}
                        />
                        <label htmlFor={card._id} style={styles.label}>
                            <div style={styles.cardTypeContainer}>
                                <span style={styles.cardType}>
                                    {card.cardType}
                                    <span style={styles.cardNumber}>
                                        {" "}
                                        {/* **** {card.cardNumber.slice(-4)} */}
                                        **** {card.cardNumber}
                                    </span>
                                </span>
                                <img
                                    src={getCardIcon(card.cardType)}
                                    alt={card.cardType}
                                    style={styles.cardIcon}
                                />
                            </div>
                            <div style={styles.cardDetails}>
                                <span style={styles.cardHolder}>{card.cardHolder}</span>
                                <br />
                                <span style={styles.expiryDate}>
                                    Expires on {card.expMonth}/{card.expYear}
                                </span>
                                <br />
                                <span style={styles.unverified}>⚠️ Unverified</span>
                            </div>
                            {selectedCard === card._id && (
                                <div style={styles.defaultBadge} onClick={() => handleSetDefaultCard(card)}>Default</div>
                            )}
                            {selectedCard === card._id && (
                                <div style={styles.deleteBadge} onClick={() => handleDeleteCard(card)}>Delete</div>
                            )}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Function to determine card icon based on card type
const getCardIcon = (cardType) => {
    switch (cardType) {
        case "Mastercard":
            return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
        case "American Express":
            return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";
        case "visa":
            return "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"; // Example URL
        default:
            return "";
    }
};
// Inline styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f7f7f7",
    },
    title: {
        marginBottom: "20px",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        Width: "100%", // Limit width to fit 3 cards in a row
    },
    card: {
        flex: "1 1 calc(33.33% - 20px)", // Flex-basis calculation for 3 cards
        maxWidth: "350px",
        width: "350px", // Full width
        maxHeight: "180px", // Fixed height
        position: "relative",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "border 0.3s ease",
    },
    selectedCard: {
        border: "2px solid #007bff",
    },
    radio: {
        position: "absolute",
        top: "10px",
        right: "10px",
        cursor: "pointer",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
    },
    cardTypeContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    cardType: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        marginRight: "8px",
    },
    cardNumber: {
        fontSize: "16px",
        color: "#666",
    },
    cardIcon: {
        width: "24px",
        height: "24px",
    },
    cardDetails: {
        fontSize: "14px",
        color: "#555",
    },
    cardHolder: {
        fontWeight: "bold",
        color: "#333",
    },
    expiryDate: {
        color: "#888",
    },
    unverified: {
        color: "#ff9900",
    },
    defaultBadge: {
        position: "absolute",
        bottom: "10px",
        right: "10px",
        padding: "2px 6px",
        backgroundColor: "#007bff",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
    },
    deleteBadge: {
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "2px 6px",
        backgroundColor: "red",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
    },
};

export default CardSelection;
