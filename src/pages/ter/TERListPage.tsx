import React, {useState, useEffect} from "react";
import DashboardPage from "../dashboard/DashboardPage";
import InfoBox from "../../components/ui/InfoBox";
import SubmitButton from "../../components/input/SubmitButton";
import InfoWidget from "../../components/ui/InfoWidget";
import ModalDialog from "../../components/input/ModalDialog"
import InputField from "../../components/input/InputField"

import TERService, { TER } from "../../services/TERService";
import TERWidget from "../../components/objects/TERWidget";
import { TbSchool } from "react-icons/tb";
import { FaRegFile, FaRegClock } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";


import "./TERListPage.css"
import HorizontalDivider from "../../components/ui/HorizontalDivider";

export default function TERListPage(){
	const [error, setError] = useState<string | null>(null);
	const [terList, setTerList] = useState<TER[] | null>(null);
	const [createTER, setCreateTER] = useState<boolean>(false);
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [year, setYear] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const getGroupCount = () => {
		let count = 0;

		terList && terList.map((ter, index) => (
			count += ter.groups.length
		));

		return count;
	}

	const getUserCount = () => {
		let count = 0;

		terList && terList.map((ter, index) => (
			ter.groups.map((group, index) => {
				count += group.members.length;
			}) 
		));

		return count;
	}

	const detailHandle = (ter: TER) => {
		console.log(ter);
	}

	const createTERHandle = async () => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setTitle("");
		setCode("");
		setYear("");
		setStartDate("");
		setEndDate("");
	}

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
			{createTER && 
				<ModalDialog onClose={() => setCreateTER(false)}>
					<div className="ter-list-addter-layout">
						<InputField label="Titre" value={title} onChange={setTitle}/>

						<HorizontalDivider/>
						<div className="ter-list-addter-container">
							<div className="ter-list-addter-container-insider">
								<InputField label="TER Code" value={code} onChange={setCode}/>
								<InputField label="Année" type="number" value={year} onChange={setYear}/>
								<InputField label="Groups"/>
							</div>

							<div className="ter-list-addter-container-insider">
								<InputField label="Date Début" type="date" value={startDate} onChange={setStartDate}/>
								<InputField label="Date Fin" type="date" value={endDate} onChange={setEndDate}/>
							</div>
						</div>
						<HorizontalDivider/>
					</div>

					<SubmitButton label="Abandonner" onChange={() => setCreateTER(false)}/>
					<SubmitButton label="Confirmer" onChange={createTERHandle}/>
				</ModalDialog>
			}
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion TERs</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Un TER" onChange={() => setCreateTER(true)}/>
					</div>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de projets TER.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="TER" icon={<TbSchool/>} info={terList ? terList.length : 0} color="var(--blue-col)"/>
				<InfoWidget label="Etudiants" icon={<FiUser/>} info={getUserCount()} color="var(--blue-col)"/>
				<InfoWidget label="Groupes" icon={<FiUsers/>} info={getGroupCount()} color="var(--green-col)"/>
				<InfoWidget label="Avancement Moyen" icon={<FaArrowTrendUp/>} info={0} color="var(--orange-col)"/>
			</div>

			{error && <InfoBox label={error} type="error"/>}

			{terList && terList.map((ter, index) => (
				<TERWidget key={index} data={ter} onClick={() => detailHandle(ter)}/>
			))}
		</DashboardPage>
	)
}