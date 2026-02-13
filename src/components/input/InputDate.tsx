import React, { useState, useEffect, ReactNode, useRef } from "react";
import Field from "../../atoms/input/Field";
import IconButton from "../button/IconButton";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

import "./InputDate.css";

interface InputDateProps {
  label?: string;
  icon?: ReactNode;
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}

export default function InputDate({label, icon, start, end, onChange}: InputDateProps){
	const [expand, setExpand] = useState<boolean>(false);
	const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

	const startBase = new Date(start);
	const endBase = new Date(end);

	const [selectedYear, setSelectedYear] = useState(startBase.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(startBase.getMonth());
	const [tempStart, setTempStart] = useState<Date | null>(null);

	useEffect(() => {
		setSelectedYear(startBase.getFullYear());
		setSelectedMonth(startBase.getMonth());
	}, [start]);

	const normalize = (d: Date) => {
		const x = new Date(d);
		x.setHours(0, 0, 0, 0);
		return x.getTime();
	};

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString("en-GB", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
	const firstDayOfMonth = (new Date(selectedYear, selectedMonth, 1).getDay() + 6) % 7;
	const monthName = new Date(selectedYear, selectedMonth).toLocaleString("en-FR", { month: "long" });

	const switchDateHandler = (step: number) => {
		const newMonth = selectedMonth + step;

		if (newMonth < 0) {
			setSelectedMonth(11);
			setSelectedYear((y) => y - 1);
		} else if (newMonth > 11) {
			setSelectedMonth(0);
			setSelectedYear((y) => y + 1);
		} else {
			setSelectedMonth(newMonth);
		}
	};

	const handleCellSelection = (day: number) => {
		const clicked = new Date(selectedYear, selectedMonth, day);

		if (!tempStart) {
			setTempStart(clicked);
			onChange(clicked.toISOString(), clicked.toISOString());
			return;
		}

		if (clicked < tempStart) {
			onChange(clicked.toISOString(), tempStart.toISOString());
		} else {
			onChange(tempStart.toISOString(), clicked.toISOString());
		}

		setTempStart(null);
	};

	const getCellStyle = (day: number) => {
		const cell = normalize(
			new Date(selectedYear, selectedMonth, day)
		);

		const s = normalize(startBase);
		const e = normalize(endBase);

		if (cell === s){
			return "first";s
		}
		if (cell === e){
			return "last";
		}

		if (cell > s && cell < e){
			return "between";
		}

		return "";
	};

	return (
		<div className="date-layout-container">
			<Field className="ter-list-label-layout" label={label} icon={icon} onClick={() => setExpand(!expand)}>
				<span>{formatDate(start)}</span>
				<span>-</span>
				<span>{formatDate(end)}</span>
			</Field>

			<Field className={`calender-layout ${expand ? "expand" : ""}`}>
				<div className="calender-header-layout">
					<IconButton icon={<IoChevronBack />} onClick={() => switchDateHandler(-1)}/>
					<span className="calender-title"> {monthName} {selectedYear}</span>
					<IconButton icon={<IoChevronForward/>} onClick={() => switchDateHandler(1)}/>
				</div>

				<div className="calender-content-style">
					{days.map((d) => (
						<div key={d} className="calender-cell">{d}</div>
					))}

					{Array.from({ length: firstDayOfMonth }).map((_, i) => (
						<div key={"b" + i} />
					))}

					{Array.from({ length: daysInMonth }, (_, i) => {
						const day = i + 1;

						return (
							<div key={day} onClick={() => handleCellSelection(day)} className={`calender-cell ${getCellStyle(day)}`}>
								{day}
							</div>
						);
					})}
				</div>
			</Field>
		</div>
	);
}