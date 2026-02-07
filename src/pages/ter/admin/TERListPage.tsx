import React, {useState, useEffect} from "react";
import DashboardPage from "../../dashboard/DashboardPage";
import InfoBox from "../../../components/ui/InfoBox";
import Button from "../../../atoms/input/Button";
import InfoWidget from "../../../components/ui/InfoWidget";
import ModalDialog from "../../../components/dialog/ModalDialog"
import InputField from "../../../components/input/InputField"
import HorizontalDivider from "../../../components/ui/HorizontalDivider";

import TERService, { TERPeriod } from "../../../services/TERService";
import TERWidget from "../../../components/objects/TERWidget";
import { TbSchool } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

import "./TERListPage.css"

export default function PeriodListPage(){
	const [error, setError] = useState<string | null>(null);
	const [terList, setTerList] = useState<TERPeriod[] | null>(null);
	const [createPeriod, setCreatePeriod] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
	const [year, setYear] = useState<number>(2000);
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [groupStartDate, setGroupStartDate] = useState<string>("");
	const [groupEndDate, setGroupEndDate] = useState<string>("");
	const [assignmentDate, setAssignmentDate] = useState<string>("");

	const location = useLocation();
    const navigate = useNavigate();

	const detailHandle = (id: string) => {
		navigate(`/dashboard/ter/list/${id}`);
	}

	const createPeriodHandle = async () => {
		try {
			await TERService.createPeriod(title, `${year - 1}-${year}`, startDate, endDate, groupStartDate, groupEndDate, assignmentDate);		
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
				<ModalDialog label="Creation TER" onClose={() => setCreatePeriod(false)}>
					<div className="ter-list-addter-layout">
						<InputField label="Titre" value={title} onChange={setTitle}/>

						<HorizontalDivider/>
						<div className="ter-list-addter-container">
							{/* <div className="ter-list-addter-container">
								<InputField label="Année" type="number" value={year} onChange={setYear}/>
								<InputField label="Groups"/>
							</div> */}

							<div className="ter-list-addter-row">
								<InputField label="Date Début Groupe" type="date" value={groupStartDate} onChange={setGroupStartDate}/>
								<InputField label="Date Fin Groupe" type="date" value={groupEndDate} onChange={setGroupEndDate}/>
							</div>

							<div className="ter-list-addter-row">
								<InputField label="Date Début" type="date" value={startDate} onChange={setStartDate}/>
								<InputField label="Date Fin" type="date" value={endDate} onChange={setEndDate}/>
							</div>

							<div className="ter-list-addter-row">
								<InputField label="Date Assignment" type="date" value={assignmentDate} onChange={setAssignmentDate}/>
							</div>
						</div>
						<HorizontalDivider/>
					</div>
					
					<div className="ter-list-buttons">
						<Button label="Abandonner" onChange={() => setCreatePeriod(false)}/>
						<Button label="Confirmer" onChange={createPeriodHandle}/>
					</div>
				</ModalDialog>
			}
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Gestion TER</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Un TER" onChange={() => setCreatePeriod(true)}/>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez les Periods.</label>

			<div className="dashbord-mini-info-layout">
				<InfoWidget label="Period Brouillon" icon={<TbSchool/>} info={terList ? terList.length : 0} color="var(--blue-col)"/>
				<InfoWidget label="Period Active" icon={<TbSchool/>} info={0} color="var(--blue-col)"/>
				<InfoWidget label="Period Terminé" icon={<TbSchool/>} info={0} color="var(--purple-col)"/>
			</div>

			{error && <InfoBox label={error} type="error"/>}

			{terList && terList.map((ter, index) => (
				<TERWidget key={index} data={ter} onClick={() => detailHandle(ter.id)}/>
			))}
		</DashboardPage>
	)
}