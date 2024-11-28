export const HTTP_STATUS_CODES = {
    CLIENT_ERROR: {
        BAD_REQUEST: 400, // Requête mal formée
        UNAUTHORIZED: 401, // Non authentifié
        PAYMENT_REQUIRED: 402, // Paiement requis
        FORBIDDEN: 403, // Non autorisé
        NOT_FOUND: 404, // Ressource non trouvée
        METHOD_NOT_ALLOWED: 405, // Méthode HTTP non autorisée
        NOT_ACCEPTABLE: 406, // Format demandé non disponible
        PROXY_AUTHENTICATION_REQUIRED: 407, // Auth proxy requise
        REQUEST_TIMEOUT: 408, // Timeout de la requête
        CONFLICT: 409, // Conflit avec l'état actuel
        GONE: 410, // Ressource plus disponible
        LENGTH_REQUIRED: 411, // Longueur requise
        PRECONDITION_FAILED: 412, // Précondition non respectée
        PAYLOAD_TOO_LARGE: 413, // Requête trop grande
        URI_TOO_LONG: 414, // URI trop longue
        UNSUPPORTED_MEDIA_TYPE: 415, // Format non supporté
        RANGE_NOT_SATISFIABLE: 416, // Plage demandée invalide
        EXPECTATION_FAILED: 417, // Attente non satisfaite
        TEAPOT: 418, // Je suis une théière (vraiment!)
        MISDIRECTED_REQUEST: 421, // Requête mal dirigée
        UNPROCESSABLE_ENTITY: 422, // Entité non traitable
        LOCKED: 423, // Ressource verrouillée
        FAILED_DEPENDENCY: 424, // Dépendance échouée
        TOO_EARLY: 425, // Trop tôt
        UPGRADE_REQUIRED: 426, // Mise à niveau requise
        PRECONDITION_REQUIRED: 428, // Précondition requise
        TOO_MANY_REQUESTS: 429, // Trop de requêtes
        REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // En-têtes trop grands
        UNAVAILABLE_FOR_LEGAL_REASONS: 451, // Non disponible légalement
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500, // Erreur serveur interne
        NOT_IMPLEMENTED: 501, // Non implémenté
        BAD_GATEWAY: 502, // Mauvaise passerelle
        SERVICE_UNAVAILABLE: 503, // Service indisponible
        GATEWAY_TIMEOUT: 504, // Timeout de la passerelle
        HTTP_VERSION_NOT_SUPPORTED: 505, // Version HTTP non supportée
        VARIANT_ALSO_NEGOTIATES: 506, // Variante négociée
        INSUFFICIENT_STORAGE: 507, // Stockage insuffisant
        LOOP_DETECTED: 508, // Boucle détectée
        NOT_EXTENDED: 510, // Non étendu
        NETWORK_AUTHENTICATION_REQUIRED: 511, // Authentification réseau requise
    },
} as const;

type ClientErrorCode = typeof HTTP_STATUS_CODES['CLIENT_ERROR'][
    keyof typeof HTTP_STATUS_CODES['CLIENT_ERROR']
];
type ServerErrorCode = typeof HTTP_STATUS_CODES['SERVER_ERROR'][
    keyof typeof HTTP_STATUS_CODES['SERVER_ERROR']
];
export type ErrorStatusCode = ClientErrorCode | ServerErrorCode;
