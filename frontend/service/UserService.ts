import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:5000/api",
    // headers: { "Content-Type": "application/json" },
    // timeout: 5000,
});

export default class UserService {
    public static async login(email: string, password: string){
        try {
            const response = await api.post("/login", {email, password});
            return response.data;
        } catch (error: any){
            if (error.response){
                throw new Error("Erreur d'authentification");
            } else {
                throw new Error("Erreur de réseau")
            }
        }
    }
};