import React, { useEffect, useState } from "react";
import Ticket from "./ticket";
import AddTicketModal from "./addticketmodal";
import { Button, message } from "antd";
import { createTicket, deleteTicketbyId, getAllTicket, updateTicketbyId } from "../../ApiService/adminApi";
import "../css/ticketmanagement.css";

const TicketManagementContent = () => {
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const TicketList = await getAllTicket();
        TicketList.sort((a, b) => b.price - a.price);
        setTickets(TicketList);
    };

    const handleSaveTicket = async (newTicket) => {
        if (editingTicket) {
            // Update ticket
            await updateTicketbyId(editingTicket._id, newTicket);
            message.success('Ticket updated successfully!');
        } else {
            // Add new ticket
            await createTicket(newTicket);
            message.success('Ticket added successfully!');
        }
        fetchTickets();
        setIsModalOpen(false);
        setEditingTicket(null);
    };

    const handleEdit = (ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleDelete = async (ticket) => {
        await deleteTicketbyId(ticket._id);
        message.success('Ticket deleted successfully!');
        fetchTickets();
    };

    const handleAddTicket = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <Button
                onClick={handleAddTicket}
                className="AD-add-user-button"
                disabled
            >
                Add Ticket
            </Button>
            <div style={{ textAlign: "center" }}>
                <h2 className="ticket-title">Ticket List</h2>
                {tickets.length === 0 ? (
                    <p>No ticket, please create a ticket</p>
                ) : (
                    <div className="ticket-list">
                        {tickets.map(ticket => (
                            <Ticket key={ticket._id} ticket={ticket} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
                <AddTicketModal
                    isModalOpen={isModalOpen}
                    handleModalClose={() => setIsModalOpen(false)}
                    handleSaveTicket={handleSaveTicket}
                    tickets={tickets}
                    editingTicket={editingTicket}
                />
            </div>
        </div>
    );
};

export default TicketManagementContent;