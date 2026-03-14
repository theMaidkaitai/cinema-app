import {action, makeObservable, observable} from "mobx";

interface UserDate {
    id?: number;
    email?: string;
    userName?: string;
    role?: string;
    subscriber?: boolean;
    exp?: number;
    iat?: number;
}



export default class UserStore {
    _isAuth: boolean = true
    _user: UserDate = {};

    constructor() {
        makeObservable(this, {
            _isAuth: observable,
            _user: observable,
            setIsAuth: action,
            setUser: action
        });
    }

    setIsAuth(isAuth: boolean) {
        this._isAuth = isAuth;
    }

    setUser(user: any) {
        this._user = user;
    }


    getUser() {
        return this._user;
    }

    get isAuth() {
        return this._isAuth;
    }

}