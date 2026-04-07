export type LanguageItem = {
    level: string;
    languageName: string;
}

export type Teacher = {
    id: string;
    teacherRating?: JSON[];
    description: string;
    writtingAboutYourself: string;
    experience: JSON;
    certeficatesList: CertificateFile[];
    pricePerHour: string;
}

export type CertificateFile = {
    year: string;
    name: string;
    description: string;
    scan: File | string | null;
}

export type Selected = Set<string>;