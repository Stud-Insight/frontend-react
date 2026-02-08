import React, {useState} from "react";
import DashboardPage from "./DashboardPage.tsx";
import ArchiveBanner from "../../components/ui/ArchiveBanner.tsx";
import "./UsersPage.css"


interface User {
    id: number;
    name: string;
    email: string;
    role: "Etudiant" | "Professeur" | "Admin";
    status: "Actif" | "En attente";
}
export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    
    // SIMULATION : On considère que la période est archivée
    const isArchived = true;

    const [users] = useState<User[]>([
        { id: 1, name: "Vincent Hannah", email: "vincent.hannah@etu.umontpellier.fr", role: "Etudiant", status: "Actif" },
        { id: 2, name: "Nabil El Zhar", email: "nabil.elzhar@prof.umontpellier.fr", role: "Professeur", status: "Actif" },
        { id: 3, name: "Alice Durand", email: "alice.durand@etu.umontpellier.fr", role: "Etudiant", status: "En attente" },
    ]);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="users-page-container">
            {/* Affichage conditionnel du bandeau (Story 11.5) */}
            {isArchived && <ArchiveBanner />}

            <div className="users-page-header">
                <h2>Gestion des Utilisateurs</h2>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td><strong>{user.name}</strong></td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                                <td><span className={`status-indicator ${user.status === 'Actif' ? 'active' : 'pending'}`}>{user.status}</span></td>
                                <td>
                                    {/* On désactive le bouton en mode archive */}
                                    <button className="edit-btn" disabled={isArchived}>Gérer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="users-page-footer">
                {/* Application du style désactivé si archivé */}
                <button 
                    className="add-user-btn" 
                    disabled={isArchived}
                    style={isArchived ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                    + Ajouter un membre
                </button>
            </div>
        </div>
    );
}