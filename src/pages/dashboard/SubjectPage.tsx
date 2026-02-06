import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import SubmitButton from "../../atoms/input/Button";
import InfoWidget from "../../components/ui/InfoWidget";
import SubjectService, { Subject, SubjectStatus } from "../../services/SubjectService";
import InfoBox from "../../components/ui/InfoBox";
import SubjectWidget from "../../components/objects/SubjectWidget";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import InputField from "../../components/input/InputField";
import ModalDialog from "../../components/dialog/ModalDialog";
import InputTagSelection from "../../components/input/InputTagSelection";
import InputArea from "../../components/input/InputArea";
import InputNumberField from "../../components/input/InputNumberField";
import InputAttachment from "../../components/input/InputAttachment";

import { FaPlus } from "react-icons/fa6";
import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

import "./SubjectPage.css"

import Button from "../../atoms/input/Button";

export default function SubjectPage(){
	const { user } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [subjects, setProjects] = useState<Subject[]>([]);
	const [page, setPage] = useState<string | null>(null);
	const [deleteSubject, setDeleteProject] = useState<Subject | null>(null);
	const [createSubject, setCreateProject] = useState<boolean>(false);
	const [title, setTitle] = useState<string>("");
	const [desc, setDesc] = useState<string>("");
	const [etuMin, setEtuMin] = useState<number>(0);
	const [etuMax, setEtuMax] = useState<number>(0);
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const draftCount = subjects.filter(p => p.status == SubjectStatus.DRAFT).length;
	const submitCount = subjects.filter(p => p.status == SubjectStatus.SUBMITTED).length;
	const approveCount = subjects.filter(p => p.status == SubjectStatus.VALIDATED).length;

	useEffect(() => {
		const getSubjects = async () => {
			try {
				const data = await SubjectService.getUserSubjects();
				setProjects([]);
			} catch (err){
				const message = err instanceof Error ? err.message : "Erreur de connexion";
				setError(message);
			}
		};
		getSubjects();
	}, []);

	const deleteHandle = async () => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const editHandle = (proj: Subject) => {

	};

	const cancelCreationHandle = () => {
		setCreateProject(false);
		setTitle("");
		setDesc("");
		setEtuMin(0);
		setEtuMax(0);
		setSelectedTags(new Set());
		setSelectedFiles([]);
	};

	const confirmCreationHandle = async () => {
		try {
			await SubjectService.createSubject(title, desc, etuMin, etuMax, selectedTags, selectedFiles);
			setSuccess(`Projet "${title}" à été créée!`);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		cancelCreationHandle();
	};

	const addTagHandle = (tag: string) => {
		setSelectedTags(prev => {
			const newSet = new Set(prev);
			newSet.add(tag);
			return newSet;
		});
	}

	const deleteTagHandle = (tag: string) => {
		setSelectedTags(prev => {
			const newSet = new Set(prev);
			newSet.delete(tag);
			return newSet;
		});
	}

	const addFileHandle = (files: File[]) => {
		setSelectedFiles((prev) => [...prev, ...files]);
	}

	const deleteFileHandle = (fileDelete: File) => {
		setSelectedFiles((prev) =>
			prev.filter((file) => file !== fileDelete)
		);
	}

	const tagOptions: string[] = [
		"JavaScript",
		"TypeScript",
		"HTML",
		"CSS",
		"Python",
		"Java",
		"C",
		"C++",
		"C#",
		"OCaml",
		"PHP",
		"Ruby",
		"Perl",
		"Lua",
	];
	
	return (
		<DashboardPage>
			{createSubject &&
				<ModalDialog label="Créer Un Nouveau Sujet" onClose={cancelCreationHandle} width={"90%"}>
					<InputField value={title} label="Titre *" onChange={setTitle}/>
					<InputArea value={desc} label="Description *" onChange={setDesc}/>

					<div className="subject-page-main-layout">
						<div className="subject-page-sub-layout">
							<InputNumberField value={etuMin} label="Étudiants Minimum *" onChange={setEtuMin} min={0} max={5}/>
							<InputNumberField value={etuMax} label="Étudiants Maximum *" onChange={setEtuMax} min={0} max={5} defaultNum={5}/>
						</div>

						<div className="subject-page-sub-layout">
							<InputTagSelection label="Tags" tags={selectedTags} options={tagOptions} onSelect={addTagHandle} onDelete={(t: string) => deleteTagHandle(t)}/>
						</div>
						
						<div className="subject-page-sub-layout">
							<InputAttachment label="Attachement" files={selectedFiles} onChange={addFileHandle} onDelete={deleteFileHandle}/>
						</div>
					</div>
					
					<Button label="Créer Sujet" icon={<FaPlus/>} onChange={confirmCreationHandle}/>
				</ModalDialog>
			}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<label style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Sujets</label>
				</div>
			
				<div className="dashboard-top-button-layout">
					<div style={{width: "auto"}}>
						<SubmitButton icon={<FaPlus/>} label="Créer Un Sujet" onChange={() => setCreateProject(true)}/>
					</div>
				</div>
			</div>
			<label style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</label>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget active={page == null} label="Sujet Créés" icon={<FaRegFile/>} info={subjects.length.toString()} color="var(--blue-col)" onClick={() => setPage(null)}/>
				<InfoWidget active={page == SubjectStatus.DRAFT} label="Sujet Brouillon" icon={<FaRegClock/>} info={draftCount.toString()} color="var(--gray1-col)" onClick={() => setPage(SubjectStatus.DRAFT)}/>
				<InfoWidget active={page == SubjectStatus.SUBMITTED} label="Sujet Soumis" icon={<FaRegCheckCircle/>} info={submitCount.toString()} color="var(--gray1-col)" onClick={() => setPage(SubjectStatus.SUBMITTED)}/>
				<InfoWidget active={page == SubjectStatus.VALIDATED} label="Sujet Approuvés" icon={<FaRegCheckCircle/>} info={approveCount.toString()} color="var(--green-col)" onClick={() => setPage(SubjectStatus.VALIDATED)}/>
			</div>

			{subjects.map((sub, index) => (
				<SubjectWidget key={index} subject={sub} onDelete={() => setDeleteProject(sub)} onEdit={() => editHandle(sub)}/>
			))}

			{deleteSubject &&
				<ConfirmationDialog 
					label="Supprimer ce projet?" 
					info="Ce projet sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées."
					onCancel={() => setDeleteProject(null)} 
					onConfirm={deleteHandle}
				/>
			}

		</DashboardPage>
	)
}