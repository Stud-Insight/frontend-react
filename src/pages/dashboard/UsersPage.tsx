import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage.tsx";
import UserService, {User} from "../../services/UserService.ts";
import PermissionTag from "../../components/ui/PermissionTag.tsx";
import "./UsersPage.css"
import "./DashboardPage.css"

export default function UsersPage(){
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await UserService.getAllUsers();
				setUsers(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchUsers();
	}, []);


    return (
        <DashboardPage>
            <label>Utilisateurs ({users.length})</label>

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
        </DashboardPage>
    )
}