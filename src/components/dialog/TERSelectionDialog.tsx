import React, {useState, useEffect} from "react";
import { User } from "../../services/UserService";
import TERService, { TERPeriod } from "../../services/TERService";
import Button from "../../atoms/input/Button";
import { FaPlus } from "react-icons/fa";
import TERWidget from "../../components/objects/TERWidget"
import ModalDialog from "./ModalDialog"

interface TERSelectionDialogProp {
	label: string;
	maxSelection?: number;
	onClose?: () => void;
	onConfirm?: (period: TERPeriod) => void;
};

export default function TERSelectionDialog({label, maxSelection = 1, onClose, onConfirm}: TERSelectionDialogProp){
	const [periods, setPeriods] = useState<TERPeriod[]>([]);
	const [selected, setSelect] = useState<Set<string>>(new Set);

	const selectionHandle = (ter: TERPeriod) => {
		setSelect(prev => {
			const newSet = new Set(prev);

			if (newSet.has(ter.id)) {
				newSet.delete(ter.id);
			} else {
				newSet.add(ter.id);
			}

			return newSet;
		});
	}

	useEffect(() => {
		const getPeriods = async () => {
			try {
				const res = await TERService.getMyPeriods();
				setPeriods(res);
			} catch {

			}
		}

		getPeriods();
	}, []);

	return (
		<ModalDialog label={label} onClose={onClose} className="user-list-dialog-content">
			<div className="user-list-layout">
				{periods && periods.map(period => (
					<TERWidget data={period} selected={selected.has(period.id)} moreInfo={false} onSelect={() => selectionHandle(period)}/>
				))}
			</div>

			<div className="user-list-buttons">
				<Button label="Annuler" style="cancel" width={`${100}%`} onClick={onClose}/>
				<Button label="Publier" width={`${100}%`} onClick={onConfirm}/>
			</div>
		</ModalDialog>
	)
}