export interface Poker {
    story:string;
    users:User[];
}

export interface User{
    name: string;
    hasVoted:boolean;
    point:number;
}
