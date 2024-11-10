// apiClient.ts

// ============================
// TypeScript Interfaces
// ============================

// Models
export interface ModelStanica {
    id: number;
    naziv?: string;
    nazivKratki?: string;
    gpsX: number;
    gpsY: number;
    smjer?: string;
    smjerId?: number;
    stanicaIdSuprotniSmjer?: number;
    polazakList?: ModelPolazak[];
    }
    
    export interface ModelPolazak {
    stanicaId: number;
    voznjaId: number;
    voznjaBusId: number;
    voznjaStanicaId: number;
    linijaId: number;
    uniqueLinijaId?: string;
    polazak?: string; // date-time
    dolazak?: string; // date-time
    }
    
    export interface ModelPolazakStanica {
    stanicaId: number;
    voznjaId: number;
    voznjaBusId: number;
    voznjaStanicaId: number;
    linijaId: number;
    uniqueLinijaId?: string;
    stanica: ModelStanica;
    polazak?: string; // date-time
    dolazak?: string; // date-time
    }
    
    export interface ModelLinija {
    id: number;
    brojLinije?: string;
    smjerId: number;
    smjerNaziv?: string;
    varijantaId: number;
    naziv?: string;
    polazakList?: ModelPolazak[];
    }
    
    export interface ModelLinijaPolazakStanica {
    id: number;
    brojLinije?: string;
    smjerId: number;
    smjerNaziv?: string;
    varijantaId: number;
    naziv?: string;
    polazakList?: ModelPolazakStanica[];
    }
    
    // Responses
    export interface RacStatusPublic {
    gbr?: number;
    lon?: number;
    lat?: number;
    voznjaId?: number;
    voznjaBusId?: number;
    }
    
    export interface RacStatusPublicListResponse {
    msg?: string;
    res?: RacStatusPublic[];
    err: boolean;
    }
    
    export interface StringModelLinijaDictionaryResponse {
    msg?: string;
    res?: { [key: string]: ModelLinija };
    err: boolean;
    }
    
    export interface StringModelLinijaPolazakStanicaDictionaryResponse {
    msg?: string;
    res?: { [key: string]: ModelLinijaPolazakStanica };
    err: boolean;
    }
    
    export interface Int32ModelStanicaDictionaryResponse {
    msg?: string;
    res?: { [key: string]: ModelStanica };
    err: boolean;
    }
    
    export interface ModelStanicaResponse {
    msg?: string;
    res: ModelStanica;
    err: boolean;
    }
    
    export interface ModelLinijaResponse {
    msg?: string;
    res: ModelLinija;
    err: boolean;
    }
    
    // ============================
    // Configuration
    // ============================
    
    const BASE_URL = 'https://api.autotrolej.hr';
    
    // ============================
    // Helper Function
    // ============================
    
    /**
    * Helper function to make GET requests using fetch.
    * @param endpoint API endpoint path.
    * @param headers Optional headers to include in the request.
    * @param params Optional query parameters as an object.
    * @returns Parsed JSON response.
    */
    const getRequest = async <T>(
    endpoint: string,
    headers?: Record<string, string>,
    params?: Record<string, string | number>
    ): Promise<T> => {
    // Construct query string if params are provided
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
    Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, String(value))
    );
    }
    
    // Configure fetch options
    const options: RequestInit = {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    ...(headers || {}),
    },
    };
    
    // Make the fetch request
    const response = await fetch(url.toString(), options);
    
    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
    `HTTP error! Status: ${response.status}, Message: ${errorText}`
    );
    }
    
    // Determine the response content type
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
    return response.json();
    } else {
    // Handle other content types if necessary
    return (await response.text()) as unknown as T;
    }
    };
    
    // ============================
    // API Functions
    // ============================
    
    /**
    * Retrieves autobus information.
    * @param gbr GBR identifier (optional).
    * @returns RacStatusPublicListResponse
    */
    export const getAutobus = async (
    gbr?: number
    ): Promise<RacStatusPublicListResponse> => {
    const params = gbr !== undefined ? { gbr } : undefined;
    
    return await getRequest<RacStatusPublicListResponse>(
    '/api/open/v1/voznired/autobus',
    undefined,
    params
    );
    };
    
    /**
    * Retrieves list of autobusi.
    * @returns RacStatusPublicListResponse
    */
    export const getAutobusi = async (): Promise<RacStatusPublicListResponse> => {
    return await getRequest<RacStatusPublicListResponse>(
    '/api/open/v1/voznired/autobusi'
    );
    };
    
    /**
    * Retrieves linije information.
    * @returns StringModelLinijaDictionaryResponse
    */
    export const getLinije = async (): Promise<StringModelLinijaDictionaryResponse> => {
    return await getRequest<StringModelLinijaDictionaryResponse>(
    '/api/open/v1/voznired/linije'
    );
    };
    
    /**
    * Retrieves stanice information.
    * @returns Int32ModelStanicaDictionaryResponse
    */
    export const getStanice = async (): Promise<Int32ModelStanicaDictionaryResponse> => {
    return await getRequest<Int32ModelStanicaDictionaryResponse>(
    '/api/open/v1/voznired/stanice'
    );
    };
    
    /**
    * Retrieves polasci information.
    * @returns StringModelLinijaPolazakStanicaDictionaryResponse
    */
    export const getPolasci = async (): Promise<StringModelLinijaPolazakStanicaDictionaryResponse> => {
    return await getRequest<StringModelLinijaPolazakStanicaDictionaryResponse>(
    '/api/open/v1/voznired/polasci'
    );
    };
    
    /**
    * Retrieves polasci for a specific stanica.
    * @param stanicaId Stanica ID.
    * @returns ModelStanicaResponse
    */
    export const getPolasciStanica = async (
    stanicaId: number
    ): Promise<ModelStanicaResponse> => {
    const params = { stanicaId };
    
    return await getRequest<ModelStanicaResponse>(
    '/api/open/v1/voznired/polasciStanica',
    undefined,
    params
    );
    };
    
    /**
    * Retrieves polasci for a specific linija.
    * @param uniqueLinijaId Unique Linija ID.
    * @returns ModelLinijaResponse
    */
    export const getPolasciLinija = async (
    uniqueLinijaId: string
    ): Promise<ModelLinijaResponse> => {
    const params = { uniqueLinijaId };
    
    return await getRequest<ModelLinijaResponse>(
    '/api/open/v1/voznired/polasciLinija',
    undefined,
    params
    );
    };
    
    // ============================
    // Export (Optional)
    // ============================
    
    export default {
    getAutobus,
    getAutobusi,
    getLinije,
    getStanice,
    getPolasci,
    getPolasciStanica,
    getPolasciLinija,
    };