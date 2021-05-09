export interface Poker {
    users:User[]
}

export interface User{
    name: string;
    hasVoted:boolean;
    point:number;
}
