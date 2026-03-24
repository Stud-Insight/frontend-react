import React, {useState} from "react";
import GradeService, { Grade } from "../../../services/GradeService";
import GradeWidget from "../../../components/objects/GradeWidget";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
	closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { FiCopy } from "react-icons/fi";

import "./TERGroupView.css"

function CoefficientBar({grades}: {grades: Grade[]}) {
	const total = Math.round(grades.reduce((sum, g) => sum + g.coefficient, 0) * 100);
	const isValid = total === 100;
	const color = isValid ? "var(--green-col)" : "var(--red-col)";

	return (
		<div style={{
			display: "flex", alignItems: "center", gap: "10px",
			padding: "8px 12px", borderRadius: "8px",
			backgroundColor: "var(--beige-col)", fontSize: "14px",
		}}>
			<div style={{
				flex: 1, height: "8px", borderRadius: "4px",
				backgroundColor: "var(--gray2-col)", overflow: "hidden",
			}}>
				<div style={{
					width: `${Math.min(total, 100)}%`, height: "100%",
					borderRadius: "4px", backgroundColor: color,
					transition: "width 0.3s",
				}}/>
			</div>
			<span style={{fontWeight: 600, color, minWidth: "60px", textAlign: "right"}}>
				{total}% / 100%
			</span>
		</div>
	);
}

interface TERGradeViewProps {
	periodId: string;
	grades: Grade[];
	readOnly?: boolean;
	onRefresh: () => void;
	onSuccess: (msg: string) => void;
	onError: (msg: string) => void;
	periods?: {id: string; name: string}[];
};

export default function TERGradeView({periodId, grades, readOnly, onRefresh, onSuccess, onError, periods}: TERGradeViewProps){
	const [addingGrade, setAddingGrade] = useState<boolean>(false);
	const [addingSubFor, setAddingSubFor] = useState<Grade | null>(null);
	const [deleteGrade, setDeleteGrade] = useState<Grade | null>(null);
	const [editGrade, setEditGrade] = useState<Grade | null>(null);
	const [name, setName] = useState<string>("");
	const [coef, setCoef] = useState<number>(50);
	const [cloneDialogOpen, setCloneDialogOpen] = useState<boolean>(false);
	const [cloneSources, setCloneSources] = useState<{id: string; name: string; count: number}[]>([]);
	const [cloneLoading, setCloneLoading] = useState<boolean>(false);
	const [cloneConfirm, setCloneConfirm] = useState<{id: string; name: string; count: number} | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
	);

	const resetGradeFields = () => {
		setName("");
		setCoef(50);
		setAddingGrade(false);
		setAddingSubFor(null);
		setDeleteGrade(null);
		setEditGrade(null);
	}

	const addGradeHandle = () => {
		resetGradeFields();
		setAddingGrade(true);
	};

	const addGradeFinished = async () => {
		try {
			await GradeService.addMainGrade(periodId, name, coef / 100);
			onSuccess(`Critère "${name}" ajouté avec succès.`);
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		resetGradeFields();
	}

	const addSubGradeHandle = (parent: Grade) => {
		resetGradeFields();
		setAddingSubFor(parent);
	};

	const addSubGradeFinished = async () => {
		if (!addingSubFor) return;
		try {
			await GradeService.addSubGrade(periodId, addingSubFor.id, name, coef / 100);
			onSuccess(`Sous-critère "${name}" ajouté avec succès.`);
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		resetGradeFields();
	}

	const editGradeHandle = (g: Grade) => {
		setName(g.name);
		setCoef(g.coefficient * 100);
		setEditGrade(g);
	}

	const editGradeFinished = async () => {
		if (!editGrade) return;
		try {
			await GradeService.updateGrade(editGrade.id, {
				name: name,
				coefficient: coef / 100,
			});
			onSuccess(`Critère "${name}" modifié avec succès.`);
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		resetGradeFields();
	}

	const deleteGradeFinished = async () => {
		if (!deleteGrade) return;
		try {
			await GradeService.deleteGrade(deleteGrade.id);
			onSuccess(`Critère "${deleteGrade.name}" supprimé avec succès.`);
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		resetGradeFields();
	}

	const openCloneDialog = async () => {
		setCloneDialogOpen(true);
		setCloneLoading(true);
		setCloneConfirm(null);
		try {
			const otherPeriods = periods?.filter(p => p.id !== periodId) || [];
			const sources: {id: string; name: string; count: number}[] = [];
			for (const p of otherPeriods) {
				const criteria = await GradeService.getGrades(p.id);
				if (criteria && criteria.length > 0) {
					const countAll = (list: Grade[]): number => {
						let n = list.length;
						for (const c of list) if (c.sub_grades) n += countAll(c.sub_grades);
						return n;
					};
					sources.push({id: p.id, name: p.name, count: countAll(criteria)});
				}
			}
			setCloneSources(sources);
		} catch {
			setCloneSources([]);
		}
		setCloneLoading(false);
	};

	const cloneFromPeriod = async (sourcePeriodId: string) => {
		try {
			await GradeService.cloneCriteria(periodId, sourcePeriodId);
			onSuccess("Critères importés avec succès.");
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
		setCloneDialogOpen(false);
	}

	// Build a flat list of all draggable IDs (roots + sub-grades)
	const allDraggableIds: string[] = [];
	const allGradesFlat = new Map<string, {grade: Grade; parentId: string | null}>();
	for (const g of grades) {
		allDraggableIds.push(g.id);
		allGradesFlat.set(g.id, {grade: g, parentId: null});
		if (g.sub_grades) {
			for (const sub of g.sub_grades) {
				allDraggableIds.push(sub.id);
				allGradesFlat.set(sub.id, {grade: sub, parentId: g.id});
			}
		}
	}

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		setActiveId(null);
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const draggedId = active.id as string;
		const targetId = over.id as string;

		const dragged = allGradesFlat.get(draggedId);
		const target = allGradesFlat.get(targetId);
		if (!dragged || !target) return;

		// Don't allow dropping a parent onto its own sub-grade
		if (dragged.parentId === null) {
			const draggedGrade = grades.find(g => g.id === draggedId);
			if (draggedGrade?.sub_grades?.some(s => s.id === targetId)) return;
		}

		// If dropping onto a root grade → make it a sub-grade of that root
		// If dropping onto a sub-grade → make it a sibling (same parent)
		const newParentId = target.parentId === null ? targetId : target.parentId;

		// Don't move if already under the same parent
		if (dragged.parentId === newParentId) return;

		try {
			await GradeService.updateGrade(draggedId, { parent_id: newParentId });
			onSuccess("Note déplacée avec succès.");
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
	};

	const detachFromParent = async (subGrade: Grade) => {
		try {
			await GradeService.updateGrade(subGrade.id, { remove_parent: true });
			onSuccess(`"${subGrade.name}" détaché avec succès.`);
			onRefresh();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Erreur de connexion";
			onError(message);
		}
	};

	const activeGradeInfo = activeId ? allGradesFlat.get(activeId) : null;
	const activeGrade = activeGradeInfo?.grade || null;

	return (
		<>
			{deleteGrade &&
				<ConfirmationDialog label="Supprimer Note" onCancel={() => setDeleteGrade(null)} onConfirm={deleteGradeFinished} info={
					`Êtes-vous sûr de vouloir supprimer la note "${deleteGrade.name}" ?`
				}/>
			}

			{addingGrade &&
				<ModalDialog label="Ajouter Note" onClose={resetGradeFields}>
					<InputField label="Nom *" value={name} onChange={setName}/>
					<InputNumberField label="Coefficient *" value={coef} min={0} max={100} step={1} onChange={setCoef}/>
					<Button label="Créer" icon={<FaPlus/>} onClick={addGradeFinished}/>
				</ModalDialog>
			}

			{addingSubFor &&
				<ModalDialog label={`Ajouter sous-critère à "${addingSubFor.name}"`} onClose={resetGradeFields}>
					<InputField label="Nom *" value={name} onChange={setName}/>
					<InputNumberField label="Coefficient *" value={coef} min={0} max={100} step={1} onChange={setCoef}/>
					<Button label="Créer" icon={<FaPlus/>} onClick={addSubGradeFinished}/>
				</ModalDialog>
			}

			{editGrade &&
				<ModalDialog label="Modifier Note" onClose={resetGradeFields}>
					<InputField label="Nom *" value={name} onChange={setName}/>
					<InputNumberField label="Coefficient *" value={coef} min={0} max={100} step={1} onChange={setCoef}/>
					<Button label="Modifier" icon={<MdOutlineEdit/>} onClick={editGradeFinished}/>
				</ModalDialog>
			}

			{cloneDialogOpen && !cloneConfirm &&
				<ModalDialog label="Importer critères d'un autre TER" onClose={() => setCloneDialogOpen(false)}>
					{cloneLoading ? (
						<span style={{color: "var(--gray1-col)"}}>Chargement des périodes...</span>
					) : cloneSources.length === 0 ? (
						<span style={{color: "var(--gray1-col)"}}>Aucune autre période avec des critères de notation.</span>
					) : (
						<div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
							{cloneSources.map(p => (
								<Button key={p.id} label={`${p.name} (${p.count} critères)`} onClick={() => setCloneConfirm(p)}/>
							))}
						</div>
					)}
				</ModalDialog>
			}

			{cloneConfirm &&
				<ConfirmationDialog
					label="Confirmer l'import"
					info={`Importer ${cloneConfirm.count} critères depuis "${cloneConfirm.name}" ? Les critères seront copiés avec leur hiérarchie.`}
					onCancel={() => { setCloneConfirm(null); }}
					onConfirm={() => { cloneFromPeriod(cloneConfirm.id); setCloneConfirm(null); }}
				/>
			}

			{!readOnly &&
				<div className="dashboard-top-layout">
					<div/>
					<div className="dashboard-top-button-layout">
						{grades.length === 0 && periods && periods.length > 1 &&
							<Button icon={<FiCopy/>} label="Importer d'un autre TER" onClick={openCloneDialog}/>
						}
						<Button icon={<FaPlus/>} label="Ajouter Note" onClick={() => addGradeHandle()}/>
					</div>
				</div>
			}

			{grades && grades.length > 0 && <CoefficientBar grades={grades}/>}

			{!readOnly && grades && grades.length > 1 && (
				<span style={{fontSize: "12px", color: "var(--gray1-col)", fontStyle: "italic"}}>
					Glissez une note sur une autre pour la regrouper en sous-critère.
				</span>
			)}

			{!readOnly ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={allDraggableIds} strategy={verticalListSortingStrategy}>
						{grades && grades.map(grade => (
							<GradeWidget key={grade.id} grade={grade}
								draggable={true}
								isDragOverlay={activeId === grade.id}
								onDelete={() => setDeleteGrade(grade)}
								onEdit={() => editGradeHandle(grade)}
								onAddSub={() => addSubGradeHandle(grade)}
								onEditSub={(sub: Grade) => editGradeHandle(sub)}
								onDeleteSub={(sub: Grade) => setDeleteGrade(sub)}
								onDetachSub={(sub: Grade) => detachFromParent(sub)}
							/>
						))}
					</SortableContext>
					<DragOverlay>
						{activeGrade && (
							<GradeWidget grade={activeGrade} isDragOverlay={true}/>
						)}
					</DragOverlay>
				</DndContext>
			) : (
				grades && grades.map(grade => (
					<GradeWidget key={grade.id} grade={grade}/>
				))
			)}
		</>
	)
}
