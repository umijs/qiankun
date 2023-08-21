"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const case_binomial_1 = require("./case_binomial");
const case_double_script_1 = require("./case_double_script");
const case_embellished_1 = require("./case_embellished");
const case_limit_1 = require("./case_limit");
const case_line_1 = require("./case_line");
const case_multiscripts_1 = require("./case_multiscripts");
const case_proof_1 = require("./case_proof");
const case_table_1 = require("./case_table");
const case_tensor_1 = require("./case_tensor");
const case_text_1 = require("./case_text");
const enrich_case_1 = require("./enrich_case");
enrich_case_1.factory.push(...[
    {
        test: case_limit_1.CaseLimit.test,
        constr: (node) => new case_limit_1.CaseLimit(node)
    },
    {
        test: case_embellished_1.CaseEmbellished.test,
        constr: (node) => new case_embellished_1.CaseEmbellished(node)
    },
    {
        test: case_double_script_1.CaseDoubleScript.test,
        constr: (node) => new case_double_script_1.CaseDoubleScript(node)
    },
    {
        test: case_tensor_1.CaseTensor.test,
        constr: (node) => new case_tensor_1.CaseTensor(node)
    },
    {
        test: case_multiscripts_1.CaseMultiscripts.test,
        constr: (node) => new case_multiscripts_1.CaseMultiscripts(node)
    },
    { test: case_line_1.CaseLine.test, constr: (node) => new case_line_1.CaseLine(node) },
    {
        test: case_binomial_1.CaseBinomial.test,
        constr: (node) => new case_binomial_1.CaseBinomial(node)
    },
    {
        test: case_proof_1.CaseProof.test,
        constr: (node) => new case_proof_1.CaseProof(node)
    },
    {
        test: case_table_1.CaseTable.test,
        constr: (node) => new case_table_1.CaseTable(node)
    },
    { test: case_text_1.CaseText.test, constr: (node) => new case_text_1.CaseText(node) }
]);
