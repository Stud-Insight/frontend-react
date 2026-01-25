import React, {useState, useEffect} from "react";
import DashboardPage from "../dashboard/DashboardPage";
import InfoBox from "../../components/ui/InfoBox";
import SubmitButton from "../../components/input/SubmitButton";
import InfoWidget from "../../components/ui/InfoWidget";

import TERService, { TER } from "../../services/TERService";
import TERWidget from "../../components/objects/TERWidget";
import { TbSchool } from "react-icons/tb";
import { FaRegFile, FaRegClock } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

import "./TERListPage.css"

export default function TERListPage(){
	const [error, setError] = useState<string | null>(null);
	const [terList, setTerList] = useState<TER[] | null>(null);
	
	useEffect(() => {
		const getAllTer = async () => {
			try {
				const data = await TERService.getAllTER();
				setTerList(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}

		getAllTer();
	}, [])
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion TERs</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Un TER"/>
					</div>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de projets TER.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="TER" icon={<TbSchool/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Avancement Moyen" icon={<FaArrowTrendUp/>} info={0} color="var(--orange-col)"/>
			</div>

			{error && <InfoBox label={error} type="error"/>}

			{terList && terList.map((ter, index) => (
				<TERWidget key={index} data={ter}/>
			))}
		</DashboardPage>
	)
}