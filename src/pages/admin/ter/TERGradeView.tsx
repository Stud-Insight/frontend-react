import React, {useState} from "react";
import GradeService, { Grade } from "../../../services/GradeService";
import GradeWidget from "../../../components/objects/GradeWidget";
import Button from "../../../atoms/input/Button";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

import { FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

interface TERGradeViewProps {
	grades: Grade[];
	onAdd?: (grade: Grade) => void;
	onEdit?: (grade: Grade) => void;
	onDelete?: (grade: Grade) => void;
};

export default function TERGradeView({grades, onAdd, onEdit, onDelete}: TERGradeViewProps){
	const [addingGrade, setAddingGrade] = useState<boolean>(false);
	const [deleteGrade, setDeleteGrade] = useState<Grade | null>(null);
	const [editGrade, setEditGrade] = useState<Grade | null>(null);
	const [name, setName] = useState<string>("");
	const [coef, setCoef] = useState<number>(50);

	const resetGradeFields = () => {
		setName("");
		setCoef(50);
		setAddingGrade(false);
		setDeleteGrade(null);
		setEditGrade(null);
	}	

	const addGradeHandle = () => {
		resetGradeFields();
		setAddingGrade(true);
	};

	const addGradeFinished = () => {
		const g: Grade = {
			id: "999",
			name: name,
			coefficient: coef / 100,
			sub_grades: []
		};

		onAdd?.(g);
		setAddingGrade(false);
	}

	const editGradeHandle = (g: Grade) => {
		setName(g.name);
		setCoef(g.coefficient * 100);
		setEditGrade(g);
	}

	return (
		<>
			{deleteGrade && 
				<ConfirmationDialog label="Supprimer Note" onCancel={() => setDeleteGrade(null)} onConfirm={() => onDelete?.(deleteGrade)} info={
					`Est vous sure de vouloir supprimer la note "${deleteGrade.name}"?`
				}/>
			}	

			{addingGrade &&
				<ModalDialog label="Ajouter Note" onClose={resetGradeFields}>
					<InputField label="Nom *" value={name} onChange={setName}/>
					<InputNumberField label="Coefficient *" value={coef} min={0} max={100} step={1} onChange={setCoef}/>
					<Button label="Créer" icon={<FaPlus/>} onClick={addGradeFinished}/>
				</ModalDialog>
			}

			{editGrade &&
				<ModalDialog label="Modifier Note" onClose={resetGradeFields}>
					<InputField label="Nom *" value={name} onChange={setName}/>
					<InputNumberField label="Coefficient *" value={coef} min={0} max={100} step={1} onChange={setCoef}/>
					<Button label="Modifier" icon={<MdOutlineEdit/>} onClick={() => onEdit?.(editGrade)}/>
				</ModalDialog>
			}

			<div className="dashboard-top-layout">
				<div/>
				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Ajouter Note" onClick={() => addGradeHandle()}/>
				</div>
			</div>

			{grades && grades.map(grade => (
				<GradeWidget grade={grade} onDelete={() => setDeleteGrade(grade)} onEdit={() => editGradeHandle(grade)}/>
			))}
		</>
	)
}