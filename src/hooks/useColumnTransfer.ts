import { useState } from "react";

type UseColumnTransferArgs = {
	maxVisibleColumns: number;
	onError: (message: string) => void;
	onSave: (payload: { visible: string[]; hidden: string[] }) => Promise<void>;
};

export function useColumnTransfer({
	maxVisibleColumns,
	onError,
	onSave,
}: UseColumnTransferArgs) {
	const [left, setLeft] = useState<string[]>([]);
	const [right, setRight] = useState<string[]>([]);
	const [checked, setChecked] = useState<string[]>([]);

	const openDialog = (hidden: string[], visible: string[]) => {
		setLeft(hidden);
		setRight(visible);
		setChecked([]);
	};

	const toggle = (item: string) => {
		setChecked((prev) =>
			prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
		);
	};

	const moveRight = () => {
		const checkedFromAvailable = checked.filter((item) => left.includes(item));
		const availableSlots = maxVisibleColumns - right.length;

		if (availableSlots <= 0) {
			onError(`Only ${maxVisibleColumns} columns can be visible at a time.`);
			return;
		}

		const itemsToMove = checkedFromAvailable.slice(0, availableSlots);

		if (checkedFromAvailable.length > availableSlots) {
			onError(`Only ${maxVisibleColumns} columns can be visible at a time.`);
		}

		setLeft((prev) => prev.filter((item) => !itemsToMove.includes(item)));
		setRight((prev) => [...prev, ...itemsToMove]);
		setChecked([]);
	};

	const moveLeft = () => {
		setRight((prev) => prev.filter((item) => !checked.includes(item)));
		setLeft((prev) => [...prev, ...checked]);
		setChecked([]);
	};

	const save = async () => {
		await onSave({
			visible: right,
			hidden: left,
		});
	};

	return {
		left,
		right,
		checked,
		openDialog,
		moveRight,
		moveLeft,
		toggle,
		save,
	};
}
