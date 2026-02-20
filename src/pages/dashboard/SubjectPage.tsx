import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import Button from "../../atoms/input/Button";
import InfoWidget from "../../components/ui/InfoWidget";
import SubjectService, { Subject, SubjectStatus, SubjectTags, SubjectStatusColor } from "../../services/SubjectService";
import InfoBox from "../../components/ui/InfoBox";
import SubjectWidget from "../../components/objects/SubjectWidget";
import ConfirmationDialog from "../../components/dialog/ConfirmationDialog";
import InputField from "../../components/input/InputField";
import ModalDialog from "../../components/dialog/ModalDialog";
import InputTagSelection from "../../components/input/InputTagSelection";
import InputArea from "../../components/input/InputArea";
import InputNumberField from "../../components/input/InputNumberField";
import InputAttachment from "../../components/input/InputAttachment";
import TERSelectionDialog from "../../components/dialog/TERSelectionDialog";
import { TERPeriod } from "../../services/TERService";

import { FaPlus } from "react-icons/fa6";
import { FaRegClock, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import "./SubjectPage.css";

export default function SubjectPage(){
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [subjects, setProjects] = useState<Subject[]>([]);
	const [page, setPage] = useState<string | null>(null);
	const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);
	const [modifySubject, setModifySubject] = useState<Subject | null>(null);
	const [createSubject, setCreateSubject] = useState<boolean>(false);
	const [publishSubject, setPublishSubject] = useState<Subject | null>(null);
	const [title, setTitle] = useState<string>("");
	const [desc, setDesc] = useState<string>("");
	const [etuMin, setEtuMin] = useState<number>(0);
	const [etuMax, setEtuMax] = useState<number>(0);
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set([]));
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const draftCount = subjects.filter(p => p.status == SubjectStatus.DRAFT).length;
	const submitCount = subjects.filter(p => p.status == SubjectStatus.SUBMITTED).length;
	const approveCount = subjects.filter(p => p.status == SubjectStatus.VALIDATED).length;

	const filteredSubjects: Subject[] = (page == null) ? subjects : subjects.filter((subject) => {
		return subject.status == page;
	});

	const maxGroupEtu: number = 5;

	const getSubjects = async () => {
		try {
			const data = await SubjectService.getUserSubjects();
			setProjects(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
	};

	const resetFieldHandle = () => {
		setCreateSubject(false);
		setModifySubject(null);
		setDeleteSubject(null);
		setPublishSubject(null);
		setTitle("");
		setDesc("");
		setEtuMin(0);
		setEtuMax(0);
		setSelectedTags(new Set());
		setSelectedFiles([]);
	};

	const deleteHandle = async () => {
		try {

		} catch(err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}
		resetFieldHandle();
	};

	const editHandle = (proj: Subject) => {
		setModifySubject(proj);
		setTitle(proj.title);
		setDesc(proj.description);
		setEtuMin(proj.min_group_size ? proj.min_group_size : 0);
		setEtuMax(proj.max_group_size ? proj.max_group_size : 0);
		setSelectedTags(new Set(proj.tags));
		setSelectedFiles([]);
	};

	const editConfirmHandle = async () => {
		try {

		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		};

		resetFieldHandle();
	}

	const confirmCreationHandle = async () => {
		try {
			await SubjectService.createSubject(title, desc, etuMin, etuMax, selectedTags, selectedFiles);
			setSuccess(`Sujet "${title}" à été créée!`);
			getSubjects();
			setTimeout(() => setSuccess(null), 5000);
		} catch (err){
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		resetFieldHandle();
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

	const onPublishHandle = async (periods: Set<TERPeriod>) => {
		try {
			const g = Array.from(periods).map(period => (
				period.id
			));

			const p: TERPeriod = Array.from(periods)[0];

			await SubjectService.publishSubject(new Set(g), publishSubject?.id);
			getSubjects();
			setSuccess(`Sujet "${publishSubject?.title}" à été soumis à "${p.name}"`);
			setTimeout(() => setSuccess(null), 5000);
		} catch(err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			setError(message);
		}

		resetFieldHandle();
	}

	useEffect(() => {
		getSubjects();
	}, []);

	return (
		<DashboardPage>
			{createSubject &&
				<ModalDialog label="Créer Un Nouveau Sujet" onClose={resetFieldHandle} className="project-modal-style">
					<InputField value={title} label="Titre *" onChange={setTitle}/>
					<InputArea value={desc} label="Description *" onChange={setDesc}/>
					<InputNumberField value={etuMin} label="Étudiants Minimum *" onChange={setEtuMin} min={0} max={maxGroupEtu}/>
					<InputNumberField value={etuMax} label="Étudiants Maximum *" onChange={setEtuMax} min={0} max={maxGroupEtu}/>
					<InputTagSelection label="Tags" tags={selectedTags} options={SubjectTags} onSelect={addTagHandle} onDelete={(t: string) => deleteTagHandle(t)}/>
					<InputAttachment label="Attachement" files={selectedFiles} onChange={addFileHandle} onDelete={deleteFileHandle}/>	
					<Button label="Créer Sujet" icon={<FaPlus/>} onClick={confirmCreationHandle}/>
				</ModalDialog>
			}

			{modifySubject &&
				<ModalDialog label="Modification Sujet" onClose={resetFieldHandle} className="project-modal-style">
					<InputField value={title} label="Titre *" onChange={setTitle}/>
					<InputArea value={desc} label="Description *" onChange={setDesc}/>
					<InputNumberField value={etuMin} label="Étudiants Minimum *" onChange={setEtuMin} min={0} max={maxGroupEtu}/>
					<InputNumberField value={etuMax} label="Étudiants Maximum *" onChange={setEtuMax} min={0} max={maxGroupEtu}/>
					<InputTagSelection label="Tags" tags={selectedTags} options={SubjectTags} onSelect={addTagHandle} onDelete={(t: string) => deleteTagHandle(t)}/>
					<InputAttachment label="Attachement" files={selectedFiles} onChange={addFileHandle} onDelete={deleteFileHandle}/>	
					<Button label="Modifier" icon={<MdOutlineEdit/>} onClick={editConfirmHandle}/>
				</ModalDialog>
			}

			{deleteSubject &&
				<ConfirmationDialog 
					label="Supprimer ce sujet?" 
					info="Ce sujet sera surpprimé définitivement de la base de donnée. Cette action est irréversible et entraînera la perte de toutes les données associées."
					onCancel={() => setDeleteSubject(null)} 
					onConfirm={deleteHandle}
				/>
			}

			{publishSubject &&
				<TERSelectionDialog label="Publier ce projet?" maxSelection={1} onClose={() => setPublishSubject(null)} onConfirm={(periods) => onPublishHandle(periods)}/>
			}

			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Mes Sujets TER</span>
				</div>
			
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Un Sujet" onClick={() => {
						setEtuMax(maxGroupEtu);
						setCreateSubject(true);
					}}/>
				</div>
			</div>
			<span style={{color: "var(--gray1-col)"}}>Créez et gérez vos propositions de sujet TER.</span>

			{error && <InfoBox label={error} type="error"/>}
			{success && <InfoBox label={success} type="success"/>}

			<div className="dashbord-mini-info-layout">
				<InfoWidget active={page == null} label="Sujet Créés" icon={<FaRegFile/>} info={subjects.length.toString()} color="var(--blue-col)" onClick={() => setPage(null)}/>
				<InfoWidget active={page == SubjectStatus.DRAFT} label="Sujet Brouillon" icon={<FaRegClock/>} info={draftCount.toString()} color={SubjectStatusColor.get(SubjectStatus.DRAFT)} onClick={() => setPage(SubjectStatus.DRAFT)}/>
				<InfoWidget active={page == SubjectStatus.SUBMITTED} label="Sujet Soumis" icon={<FaRegCheckCircle/>} info={submitCount.toString()} color={SubjectStatusColor.get(SubjectStatus.SUBMITTED)} onClick={() => setPage(SubjectStatus.SUBMITTED)}/>
				<InfoWidget active={page == SubjectStatus.VALIDATED} label="Sujet Approuvés" icon={<FaRegCheckCircle/>} info={approveCount.toString()} color={SubjectStatusColor.get(SubjectStatus.VALIDATED)} onClick={() => setPage(SubjectStatus.VALIDATED)}/>
			</div>

			{filteredSubjects.map((sub, index) => (
				<SubjectWidget key={index} subject={sub} 
				onDelete={() => setDeleteSubject(sub)} 
				onEdit={() => editHandle(sub)}
				onPublish={() => setPublishSubject(sub)}
				/>
			))}

		</DashboardPage>
	)
}