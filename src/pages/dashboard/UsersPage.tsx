import React from "react";
import DashboardPage from "./DashboardPage.tsx";
import UserService, {User} from "../../services/UserService.ts";
import PermissionTag from "../../components/ui/PermissionTag.tsx";
import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){

    //TODO: Faire populer ce truc dynamiquement avec api
    const users: User[] = [
        {
            id: "1",
            email: "test@example.com",
            first_name: "Clémentine",
            last_name: "Nébut",
            groups: [],
            is_staff: false,
            is_superuser: false,
        },
        {
            id: "1",
            email: "test@example.com",
            first_name: "Clémentine",
            last_name: "Nébut",
            groups: [],
            is_staff: false,
            is_superuser: false,
        },
        {
            id: "1",
            email: "test@example.com",
            first_name: "Clémentine",
            last_name: "Nébut",
            groups: [],
            is_staff: false,
            is_superuser: false,
        }
    ];

    return (
        <DashboardPage>
            <label>Utilisateurs</label>

            <div className="users-table-content-style">
                <table className="users-table-style">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Date Activation</th>
                            <th>Dernière Connection</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td><input type="checkbox" className="checkbox-users-selection"></input></td>
                                <td> {user.first_name} {user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{"eelele"}</td>
                                <td>{"eelele"}</td>
                                <td><PermissionTag perm={"etu"}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardPage>
    )
}