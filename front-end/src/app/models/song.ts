export class Song{
    constructor(
        public _id: number,
        public number: number,
        public nombre: string,
        public duration: number,
        public file: string,
        public album: string
    ){}
}