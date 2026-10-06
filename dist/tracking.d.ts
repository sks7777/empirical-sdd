import { z } from "zod";
import { type TrackerWaiver } from "./protocol.js";
import type { LinearTrackerPolicy, TrackerBindInput, TrackerWaiveInput, TrackerBindResult, TrackerBinding, TrackerArtifact, TrackerAdapterCapabilities, TrackerDiscovery, TrackerDiscoveryInput, TrackerDiscoveryResource, TrackerEnforcement, TrackerMutationGate, TrackerMappingSuggestion, TrackerDependencies, EffectiveTrackerPolicy, TrackerFailure, TrackerPendingRecord, TrackerPolicy, TrackerPolicyPreview, TrackerProgressState, TrackerProjection, TrackerProvider, TrackerStateMap, TrackerStatus, TrackerSetupChange, TrackerSyncResult, TrackerTicketRequirement, TrackerTicketResolution, TrackerTicketRules, TrackerTransport, WorkflowState } from "./types.js";
export declare const TRACKER_SCHEMA_VERSION: 2;
export declare const TRACKER_LEGACY_SCHEMA_VERSION: 1;
export declare const DISABLED_TRACKER_SETUP: {
    readonly schemaVersion: 1;
    readonly mode: "disabled";
};
export declare const trackerPolicySchema: z.ZodUnion<readonly [z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    provider: z.ZodLiteral<"github">;
    target: z.ZodObject<{
        owner: z.ZodString;
        repository: z.ZodString;
        projectId: z.ZodString;
        statusFieldId: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    provider: z.ZodLiteral<"github">;
    target: z.ZodObject<{
        owner: z.ZodString;
        repository: z.ZodString;
        projectId: z.ZodString;
        statusFieldId: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
    ticket: z.ZodEnum<{
        ensure: "ensure";
        manual: "manual";
        off: "off";
    }>;
    visibility: z.ZodEnum<{
        "blockers-final": "blockers-final";
        milestones: "milestones";
        revisions: "revisions";
    }>;
    enforcement: z.ZodOptional<z.ZodEnum<{
        "best-effort": "best-effort";
        strict: "strict";
    }>>;
    ticketRules: z.ZodOptional<z.ZodObject<{
        feature: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        fix: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        chore: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    lifecycle: z.ZodOptional<z.ZodObject<{
        doneWhen: z.ZodEnum<{
            deployment: "deployment";
            release: "release";
            workflow: "workflow";
        }>;
        readyForRelease: z.ZodString;
        readyForDeployment: z.ZodString;
        productionEnvironment: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    provider: z.ZodLiteral<"linear">;
    target: z.ZodObject<{
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    provider: z.ZodLiteral<"linear">;
    target: z.ZodObject<{
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
    ticket: z.ZodEnum<{
        ensure: "ensure";
        manual: "manual";
        off: "off";
    }>;
    visibility: z.ZodEnum<{
        "blockers-final": "blockers-final";
        milestones: "milestones";
        revisions: "revisions";
    }>;
    enforcement: z.ZodOptional<z.ZodEnum<{
        "best-effort": "best-effort";
        strict: "strict";
    }>>;
    ticketRules: z.ZodOptional<z.ZodObject<{
        feature: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        fix: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        chore: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    lifecycle: z.ZodOptional<z.ZodObject<{
        doneWhen: z.ZodEnum<{
            deployment: "deployment";
            release: "release";
            workflow: "workflow";
        }>;
        readyForRelease: z.ZodString;
        readyForDeployment: z.ZodString;
        productionEnvironment: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    provider: z.ZodLiteral<"linear">;
    connection: z.ZodLiteral<"linear-mcp">;
    target: z.ZodObject<{
        teamId: z.ZodString;
        projectId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
    ticket: z.ZodEnum<{
        ensure: "ensure";
        manual: "manual";
        off: "off";
    }>;
    visibility: z.ZodEnum<{
        "blockers-final": "blockers-final";
        milestones: "milestones";
        revisions: "revisions";
    }>;
    enforcement: z.ZodOptional<z.ZodEnum<{
        "best-effort": "best-effort";
        strict: "strict";
    }>>;
    ticketRules: z.ZodOptional<z.ZodObject<{
        feature: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        fix: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        chore: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    lifecycle: z.ZodOptional<z.ZodObject<{
        doneWhen: z.ZodEnum<{
            deployment: "deployment";
            release: "release";
            workflow: "workflow";
        }>;
        readyForRelease: z.ZodString;
        readyForDeployment: z.ZodString;
        productionEnvironment: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    provider: z.ZodLiteral<"jira">;
    target: z.ZodObject<{
        siteUrl: z.ZodString;
        projectKey: z.ZodString;
        issueTypeId: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        email: z.ZodString;
        apiToken: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    provider: z.ZodLiteral<"jira">;
    target: z.ZodObject<{
        siteUrl: z.ZodString;
        projectKey: z.ZodString;
        issueTypeId: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        email: z.ZodString;
        apiToken: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
    ticket: z.ZodEnum<{
        ensure: "ensure";
        manual: "manual";
        off: "off";
    }>;
    visibility: z.ZodEnum<{
        "blockers-final": "blockers-final";
        milestones: "milestones";
        revisions: "revisions";
    }>;
    enforcement: z.ZodOptional<z.ZodEnum<{
        "best-effort": "best-effort";
        strict: "strict";
    }>>;
    ticketRules: z.ZodOptional<z.ZodObject<{
        feature: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        fix: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        chore: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    lifecycle: z.ZodOptional<z.ZodObject<{
        doneWhen: z.ZodEnum<{
            deployment: "deployment";
            release: "release";
            workflow: "workflow";
        }>;
        readyForRelease: z.ZodString;
        readyForDeployment: z.ZodString;
        productionEnvironment: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    provider: z.ZodLiteral<"plane">;
    target: z.ZodObject<{
        baseUrl: z.ZodString;
        workspaceSlug: z.ZodString;
        projectId: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strict>;
    states: z.ZodObject<{
        specification: z.ZodString;
        planned: z.ZodString;
        "in-progress": z.ZodString;
        verification: z.ZodString;
        review: z.ZodString;
        blocked: z.ZodString;
        done: z.ZodString;
    }, z.core.$strict>;
    ticket: z.ZodEnum<{
        ensure: "ensure";
        manual: "manual";
        off: "off";
    }>;
    visibility: z.ZodEnum<{
        "blockers-final": "blockers-final";
        milestones: "milestones";
        revisions: "revisions";
    }>;
    enforcement: z.ZodOptional<z.ZodEnum<{
        "best-effort": "best-effort";
        strict: "strict";
    }>>;
    ticketRules: z.ZodOptional<z.ZodObject<{
        feature: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        fix: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
        chore: z.ZodObject<{
            fast: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            quick: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
            complex: z.ZodEnum<{
                off: "off";
                optional: "optional";
                required: "required";
            }>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    lifecycle: z.ZodOptional<z.ZodObject<{
        doneWhen: z.ZodEnum<{
            deployment: "deployment";
            release: "release";
            workflow: "workflow";
        }>;
        readyForRelease: z.ZodString;
        readyForDeployment: z.ZodString;
        productionEnvironment: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>]>;
export declare const trackerSetupChangeSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"preserve">;
}, z.core.$strict>, z.ZodObject<{
    mode: z.ZodLiteral<"disabled">;
}, z.core.$strict>, z.ZodObject<{
    mode: z.ZodLiteral<"apply">;
    policy: z.ZodUnion<readonly [z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        provider: z.ZodLiteral<"github">;
        target: z.ZodObject<{
            owner: z.ZodString;
            repository: z.ZodString;
            projectId: z.ZodString;
            statusFieldId: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<2>;
        provider: z.ZodLiteral<"github">;
        target: z.ZodObject<{
            owner: z.ZodString;
            repository: z.ZodString;
            projectId: z.ZodString;
            statusFieldId: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
        ticket: z.ZodEnum<{
            ensure: "ensure";
            manual: "manual";
            off: "off";
        }>;
        visibility: z.ZodEnum<{
            "blockers-final": "blockers-final";
            milestones: "milestones";
            revisions: "revisions";
        }>;
        enforcement: z.ZodOptional<z.ZodEnum<{
            "best-effort": "best-effort";
            strict: "strict";
        }>>;
        ticketRules: z.ZodOptional<z.ZodObject<{
            feature: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            fix: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            chore: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        lifecycle: z.ZodOptional<z.ZodObject<{
            doneWhen: z.ZodEnum<{
                deployment: "deployment";
                release: "release";
                workflow: "workflow";
            }>;
            readyForRelease: z.ZodString;
            readyForDeployment: z.ZodString;
            productionEnvironment: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        provider: z.ZodLiteral<"linear">;
        target: z.ZodObject<{
            teamId: z.ZodString;
            projectId: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<2>;
        provider: z.ZodLiteral<"linear">;
        target: z.ZodObject<{
            teamId: z.ZodString;
            projectId: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
        ticket: z.ZodEnum<{
            ensure: "ensure";
            manual: "manual";
            off: "off";
        }>;
        visibility: z.ZodEnum<{
            "blockers-final": "blockers-final";
            milestones: "milestones";
            revisions: "revisions";
        }>;
        enforcement: z.ZodOptional<z.ZodEnum<{
            "best-effort": "best-effort";
            strict: "strict";
        }>>;
        ticketRules: z.ZodOptional<z.ZodObject<{
            feature: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            fix: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            chore: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        lifecycle: z.ZodOptional<z.ZodObject<{
            doneWhen: z.ZodEnum<{
                deployment: "deployment";
                release: "release";
                workflow: "workflow";
            }>;
            readyForRelease: z.ZodString;
            readyForDeployment: z.ZodString;
            productionEnvironment: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<2>;
        provider: z.ZodLiteral<"linear">;
        connection: z.ZodLiteral<"linear-mcp">;
        target: z.ZodObject<{
            teamId: z.ZodString;
            projectId: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
        ticket: z.ZodEnum<{
            ensure: "ensure";
            manual: "manual";
            off: "off";
        }>;
        visibility: z.ZodEnum<{
            "blockers-final": "blockers-final";
            milestones: "milestones";
            revisions: "revisions";
        }>;
        enforcement: z.ZodOptional<z.ZodEnum<{
            "best-effort": "best-effort";
            strict: "strict";
        }>>;
        ticketRules: z.ZodOptional<z.ZodObject<{
            feature: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            fix: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            chore: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        lifecycle: z.ZodOptional<z.ZodObject<{
            doneWhen: z.ZodEnum<{
                deployment: "deployment";
                release: "release";
                workflow: "workflow";
            }>;
            readyForRelease: z.ZodString;
            readyForDeployment: z.ZodString;
            productionEnvironment: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        provider: z.ZodLiteral<"jira">;
        target: z.ZodObject<{
            siteUrl: z.ZodString;
            projectKey: z.ZodString;
            issueTypeId: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            email: z.ZodString;
            apiToken: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<2>;
        provider: z.ZodLiteral<"jira">;
        target: z.ZodObject<{
            siteUrl: z.ZodString;
            projectKey: z.ZodString;
            issueTypeId: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            email: z.ZodString;
            apiToken: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
        ticket: z.ZodEnum<{
            ensure: "ensure";
            manual: "manual";
            off: "off";
        }>;
        visibility: z.ZodEnum<{
            "blockers-final": "blockers-final";
            milestones: "milestones";
            revisions: "revisions";
        }>;
        enforcement: z.ZodOptional<z.ZodEnum<{
            "best-effort": "best-effort";
            strict: "strict";
        }>>;
        ticketRules: z.ZodOptional<z.ZodObject<{
            feature: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            fix: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            chore: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        lifecycle: z.ZodOptional<z.ZodObject<{
            doneWhen: z.ZodEnum<{
                deployment: "deployment";
                release: "release";
                workflow: "workflow";
            }>;
            readyForRelease: z.ZodString;
            readyForDeployment: z.ZodString;
            productionEnvironment: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>, z.ZodObject<{
        schemaVersion: z.ZodLiteral<2>;
        provider: z.ZodLiteral<"plane">;
        target: z.ZodObject<{
            baseUrl: z.ZodString;
            workspaceSlug: z.ZodString;
            projectId: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strict>;
        states: z.ZodObject<{
            specification: z.ZodString;
            planned: z.ZodString;
            "in-progress": z.ZodString;
            verification: z.ZodString;
            review: z.ZodString;
            blocked: z.ZodString;
            done: z.ZodString;
        }, z.core.$strict>;
        ticket: z.ZodEnum<{
            ensure: "ensure";
            manual: "manual";
            off: "off";
        }>;
        visibility: z.ZodEnum<{
            "blockers-final": "blockers-final";
            milestones: "milestones";
            revisions: "revisions";
        }>;
        enforcement: z.ZodOptional<z.ZodEnum<{
            "best-effort": "best-effort";
            strict: "strict";
        }>>;
        ticketRules: z.ZodOptional<z.ZodObject<{
            feature: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            fix: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
            chore: z.ZodObject<{
                fast: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                quick: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
                complex: z.ZodEnum<{
                    off: "off";
                    optional: "optional";
                    required: "required";
                }>;
            }, z.core.$strict>;
        }, z.core.$strict>>;
        lifecycle: z.ZodOptional<z.ZodObject<{
            doneWhen: z.ZodEnum<{
                deployment: "deployment";
                release: "release";
                workflow: "workflow";
            }>;
            readyForRelease: z.ZodString;
            readyForDeployment: z.ZodString;
            productionEnvironment: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>]>;
}, z.core.$strict>], "mode">;
export type TrackerSetupState = {
    mode: "unconfigured";
    policy: null;
} | {
    mode: "disabled";
    policy: null;
} | {
    mode: "configured";
    policy: TrackerPolicy;
};
export declare const trackerCreateBindInputSchema: z.ZodObject<{
    mode: z.ZodLiteral<"create">;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    replace: z.ZodOptional<z.ZodLiteral<true>>;
    confirmCreateRetry: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const trackerAttachBindInputSchema: z.ZodObject<{
    mode: z.ZodLiteral<"attach">;
    ticket: z.ZodString;
    replace: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>;
export declare const trackerBindInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"create">;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    replace: z.ZodOptional<z.ZodLiteral<true>>;
    confirmCreateRetry: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>, z.ZodObject<{
    mode: z.ZodLiteral<"attach">;
    ticket: z.ZodString;
    replace: z.ZodOptional<z.ZodLiteral<true>>;
}, z.core.$strict>], "mode">;
export declare const trackerDiscoveryInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    provider: z.ZodLiteral<"github">;
    credentialEnv: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    provider: z.ZodLiteral<"linear">;
    credentialEnv: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    provider: z.ZodLiteral<"jira">;
    target: z.ZodObject<{
        siteUrl: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        email: z.ZodString;
        apiToken: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    provider: z.ZodLiteral<"plane">;
    target: z.ZodObject<{
        baseUrl: z.ZodString;
        workspaceSlug: z.ZodString;
    }, z.core.$strict>;
    credentialEnv: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>], "provider">;
export declare const trackerMappingInputSchema: z.ZodObject<{
    input: z.ZodDiscriminatedUnion<[z.ZodObject<{
        provider: z.ZodLiteral<"github">;
        credentialEnv: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        provider: z.ZodLiteral<"linear">;
        credentialEnv: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        provider: z.ZodLiteral<"jira">;
        target: z.ZodObject<{
            siteUrl: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            email: z.ZodString;
            apiToken: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>, z.ZodObject<{
        provider: z.ZodLiteral<"plane">;
        target: z.ZodObject<{
            baseUrl: z.ZodString;
            workspaceSlug: z.ZodString;
        }, z.core.$strict>;
        credentialEnv: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>], "provider">;
    stateParentId: z.ZodString;
}, z.core.$strict>;
export declare function parseTrackerDiscoveryInput(value: unknown): TrackerDiscoveryInput;
export declare function parseTrackerBindInput(value: unknown): TrackerBindInput;
export declare function parseTrackerPolicy(value: unknown): TrackerPolicy;
export declare function parseTrackerSetupChange(value: unknown): TrackerSetupChange;
export declare function effectiveTrackerPolicy(policy: TrackerPolicy): EffectiveTrackerPolicy;
export declare function recommendedTrackerTicketRules(): TrackerTicketRules;
export declare function allTrackerTicketRules(): TrackerTicketRules;
export declare function resolveTrackerTicketRequirement(policy: TrackerPolicy, state: Pick<WorkflowState, "request" | "profile">): TrackerTicketResolution;
export declare function trackerMutationGate(input: {
    enforcement: TrackerEnforcement;
    requirement: TrackerTicketRequirement;
    health: TrackerStatus["health"];
    url: string | null;
    committedRevision: number;
    lastSyncedRevision: number | null;
    pendingRevision: number | null;
    pendingEffects: number;
    failure: TrackerFailure | null;
}): TrackerMutationGate;
export declare function loadTrackerPolicy(root: string): Promise<TrackerPolicy | null>;
export declare function loadTrackerSetupState(root: string): Promise<TrackerSetupState>;
export declare function configureTrackerPolicy(root: string, value: unknown, dependencies?: TrackerDependencies): Promise<TrackerPolicy | null>;
export declare function discoverTracker(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerDiscovery>;
export declare function createTrackerDiscoveryFromResources(provider: TrackerProvider, resources: TrackerDiscoveryResource[], capabilities?: TrackerAdapterCapabilities): TrackerDiscovery;
export declare function suggestTrackerStateMapping(discovery: TrackerDiscovery, stateParentId?: string): TrackerMappingSuggestion;
export declare function proposeTrackerStateMapping(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerMappingSuggestion>;
export declare function previewTrackerPolicy(value: unknown, dependencies?: TrackerDependencies): Promise<TrackerPolicyPreview>;
export declare function previewTrackerPolicyFromDiscovery(value: unknown, discovery: TrackerDiscovery): TrackerPolicyPreview;
export declare function isLinearMcpPolicy(policy: TrackerPolicy): policy is Extract<LinearTrackerPolicy, {
    connection: "linear-mcp";
}>;
/**
 * v2 transport migration that preserves target, states, ticket rules and
 * enforcement. v1's legacy projection becomes one comment per phase change
 * (milestones), not one per revision.
 */
export declare function linearMcpPolicyMigration(policy: LinearTrackerPolicy): Extract<LinearTrackerPolicy, {
    connection: "linear-mcp";
}>;
export declare function trackerProgress(state: WorkflowState, policy?: TrackerPolicy | null): TrackerProgressState;
export declare function createTrackerProjection(state: WorkflowState, policy?: TrackerPolicy | null, artifacts?: TrackerArtifact[]): TrackerProjection;
export declare function trackerStatus(root: string, state: WorkflowState, dependencies?: TrackerDependencies): Promise<TrackerStatus>;
export declare function bindTracker(root: string, state: WorkflowState, input: TrackerBindInput, dependencies?: TrackerDependencies, options?: {
    linkOnly?: boolean;
}): Promise<TrackerBindResult>;
export declare function synchronizeTrackerAfterCommit(root: string, state: WorkflowState, dependencies?: TrackerDependencies): Promise<TrackerStatus>;
export declare function resumeTrackerSynchronization(root: string, current: WorkflowState, dependencies?: TrackerDependencies): Promise<Array<{
    feature: string;
    tracker: TrackerStatus;
}>>;
export declare function synchronizeTracker(root: string, state: WorkflowState, dependencies?: TrackerDependencies): Promise<TrackerSyncResult>;
export declare const defaultTrackerTransport: TrackerTransport;
/**
 * Read and validate durable tracker records without taking a lock, contacting a
 * provider, or mutating recovery state. This deliberately works without a
 * configured policy so Doctor can detect dormant/corrupt tracker artifacts.
 */
export declare function inspectTrackerRecords(root: string, feature: string): Promise<{
    binding: TrackerBinding | null;
    pending: TrackerPendingRecord | null;
}>;
export declare const trackerWaiveInputSchema: z.ZodObject<{
    revision: z.ZodNumber;
    reason: z.ZodEnum<{
        abandoned: "abandoned";
        "tracked-elsewhere": "tracked-elsewhere";
    }>;
    justification: z.ZodString;
    ticket: z.ZodOptional<z.ZodString>;
    actor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare function parseTrackerWaiveInput(value: unknown): TrackerWaiveInput;
/**
 * Validate that a feature's unresolved tracker projection may be waived and build
 * the audited record. Reads only local records; never contacts a provider. The
 * caller commits the record to the journal, then clears the resolved files.
 */
export declare function prepareTrackerWaiver(root: string, state: WorkflowState, input: TrackerWaiveInput, actor: string, dependencies?: TrackerDependencies): Promise<TrackerWaiver>;
/** Remove the pending projection a committed waiver resolved. */
export declare function removeWaivedTrackerPending(root: string, state: WorkflowState): Promise<void>;
export declare function validatePlaneBaseUrl(value: string): string;
export type { TrackerBinding, TrackerPendingRecord, TrackerPolicy, TrackerProjection, TrackerStateMap, TrackerStatus, };
