import React, {useState, useEffect} from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import InfoWidget from "../../../components/ui/InfoWidget";
import ModalDialog from "../../../components/dialog/ModalDialog"
import InputField from "../../../components/input/InputField"
import HorizontalDivider from "../../../components/ui/HorizontalDivider";
import InputDate from "../../../components/input/InputDate";
import TERService, { TERPeriod } from "../../../services/TERService";
import TERWidget from "../../../components/objects/TERWidget";
import { TbSchool } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineCalendar } from "react-icons/hi";

import "./TERListPage.css"

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
	const [startDate, setStartDate] = useState<string>(addDays(12));
	const [endDate, setEndDate] = useState<string>(addDays(100));

	const location = useLocation();
    const navigate = useNavigate();

	const detailHandle = (id: string) => {
		navigate(`/dashboard/ter/list/${id}`);
	}

	const createPeriodHandle = async () => {
		try {
			await TERService.createPeriod(title, `${year - 1}-${year}`, startDate, endDate, groupStartDate, groupEndDate, projectStartDate, projectEndDate, assignmentDate);
			setSuccess(`TER "${title}" ajouté au systéme.`);
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
		const getAllTer = async () => {
			try {
				const data = await TERService.getAllPeriods();
				setTerList(data);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		}
		
		getAllTer();
	}, []);

	return (
		<DashboardPage>
			{createPeriod && 
				<ModalDialog label="Creation TER" onClose={() => setCreatePeriod(false)} className="ter-list-modal-style ">
					<InputField label="Titre" value={title} onChange={setTitle}/>

					<div className="ter-list-addter-row">
						<InputDate label="Groupe Formation" start={groupStartDate} end={groupEndDate} onChange={(s, e) => {
							setGroupStartDate(s);
							setGroupEndDate(e);
						}}/>

						<InputDate label="Groupe Projet Attribution" start={projectStartDate} end={projectEndDate} onChange={(s, e) => {
							setProjectStartDate(s);
							setProjectEndDate(e);
						}}/>

						<InputDate label="SPRINT 1" start={startDate} end={endDate} onChange={(s, e) => {
							setStartDate(s);
							setEndDate(e);
						}}/>
					</div>
					<div className="ter-list-buttons">
						<Button label="Confirmer" onClick={createPeriodHandle}/>
					</div>
				</ModalDialog>
			}
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion TER</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Un TER" onClick={() => setCreatePeriod(true)}/>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez les Periods.</label>
			
			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="TER Brouillon" icon={<TbSchool/>} info={terList ? terList.length : 0} color="var(--blue-col)"/>
				<InfoWidget label="TER Active" icon={<TbSchool/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="TER Terminé" icon={<TbSchool/>} info={0} color="var(--purple-col)"/>
			</div>

			{terList && terList.map((ter, index) => (
				<TERWidget key={index} data={ter} onClick={() => detailHandle(ter.id)}/>
			))}
		</DashboardPage>
	)
}