import { Question } from "./Question"

export type Interview = {
    _id?: string,
    key?: string,
    name?: string,
    questions?: Array<Question>,
    result?: string,
    date_start?: string,
    date_finish?: string
}