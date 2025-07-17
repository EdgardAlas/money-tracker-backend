export class GoalResponseDto {
	public id: string;
	public name: string;
	public target: number;
	public dueDate: string | null;
	public currentAmount: number;
	public income: number | null;
	public expense: number | null;

	constructor(props: GoalResponseDto) {
		Object.assign(this, props);
	}
}
