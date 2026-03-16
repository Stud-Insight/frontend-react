import React, {useState, useEffect} from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import InfoWidget from "../../../components/ui/InfoWidget";
import ModalDialog from "../../../components/dialog/ModalDialog"
import InputField from "../../../components/input/InputField"
import InputDate from "../../../components/input/InputDate";
import InputNumberField from "../../../components/input/InputNumberField"
import TERService, { TERPeriod, TERStatus, TERStatusColor } from "../../../services/TERService";
import TERWidget from "../../../components/objects/TERWidget";
import { TbSchool } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { HiOutlineCalendar } from "react-icons/hi";

import "./TERListPage.css";

export default function PeriodListPage(){
	const addDays = (days: number) => {
		const d = new Date();
		d.setDate(d.getDate() + days);
		return d.toISOString().split("T")[0];
	};

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [terList, setTerList] = useState<TERPeriod[] | null>(null);
	const [createPeriod, setCreatePeriod] = useState<boolean>(false);
	const [year, setYear] = useState<number>(new Date().getFullYear());
	const [title, setTitle] = useState<string>("");
	const [groupStartDate, setGroupStartDate] = useState<string>(addDays(0));
	const [groupEndDate, setGroupEndDate] = useState<string>(addDays(7));
	const [projectStartDate, setProjectStartDate] = useState<string>(addDays(8));
	const [projectEndDate, setProjectEndDate] = useState<string>(addDays(10));
	const [assignmentDate, setAssignmentDate] = useState<string>(addDays(11));
	const [minGroup, setMinGroup] = useState<number>(2);
	const [maxGroup, setMaxGroup] = useState<number>(4);
	const [startDate, setStartDate] = useState<string>(addDays(12));
	const [endDate, setEndDate] = useState<string>(addDays(100));

    const navigate = useNavigate();

	const draftPeriods = terList?.filter(period => period.status == TERStatus.DRAFT).length;
	const openPeriods = terList?.filter(period => period.status == TERStatus.OPEN).length;
	const closePeriods = terList?.filter(period => period.status == TERStatus.CLOSED).length;

	const getAllTer = async () => {
		try {
			const data = await TERService.getPeriods();
			setTerList(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	}

	const clickHandle = (id: string) => {
		navigate(`/dashboard/ter/${id}/admin`);
	}

	const createPeriodHandle = async () => {
		try {
			await TERService.createPeriod(title, `${year - 1}-${year}`, startDate, endDate, groupStartDate, groupEndDate, projectStartDate, projectEndDate, assignmentDate);
			setSuccess(`TER "${title}" ajouté au système.`);
			getAllTer();
		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		setTitle("");
		setYear(2000);
		setStartDate("");
		setEndDate("");
		setCreatePeriod(false);
	}

	useEffect(() => {
		getAllTer();
	}, []);

	return (
		<DashboardPage>
			{createPeriod && 
				<ModalDialog label="Creation TER" onClose={() => setCreatePeriod(false)} className="ter-list-modal-style">
					<InputField label="Titre" value={title} onChange={setTitle}/>

					<InputDate label="Groupe Formation" start={groupStartDate} end={groupEndDate} onChange={(s, e) => {
						setGroupStartDate(s);
						setGroupEndDate(e);
					}}/>

					<InputDate label="Projet Attribution" start={projectStartDate} end={projectEndDate} onChange={(s, e) => {
						setProjectStartDate(s);
						setProjectEndDate(e);
					}}/>

					<InputDate label="SPRINT 1" start={startDate} end={endDate} onChange={(s, e) => {
						setStartDate(s);
						setEndDate(e);
					}}/>
					
					<InputNumberField value={minGroup} label="Min Membre Par Groupe" onChange={setMinGroup}/>
					<InputNumberField value={maxGroup} label="Max Membre Par Groupe" onChange={setMaxGroup}/>

					<div className="ter-list-buttons">
						<Button label="Annuler" onClick={() => setCreatePeriod(false)} color="var(--gray1-col)"/>
						<Button label="Confirmer" onClick={createPeriodHandle}/>
					</div>
				</ModalDialog>
			}
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion TER</span>
				</div>
			
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Un TER" onClick={() => setCreatePeriod(true)}/>
				</div>
			</div>
			<span style={{color: "var(--gray1-col)"}}>Créez et gérez les TERs.</span>
			
			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="TER Brouillon" icon={<TbSchool/>} info={draftPeriods} color={TERStatusColor.get(TERStatus.DRAFT)}/>
				<InfoWidget label="TER Active" icon={<TbSchool/>} info={openPeriods} color={TERStatusColor.get(TERStatus.OPEN)}/>
				<InfoWidget label="TER Terminé" icon={<TbSchool/>} info={closePeriods} color={TERStatusColor.get(TERStatus.CLOSED)}/>
			</div>

			{terList && terList.map(ter => (
				<TERWidget key={ter.id} period={ter} onClick={() => clickHandle(ter.id)} moreInfo={true}/>
			))}
		</DashboardPage>
	)
}