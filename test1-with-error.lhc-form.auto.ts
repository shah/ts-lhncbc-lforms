import type * as lform from "./lform.ts";

export const form: lform.NihLhcForm = {
  name: "CARIN Alliance Code of Conduct",
  items: [
    {
      question: "CONSENT",
      questionCode: "CACC-HEADER1",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: "bad data",
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Does the solution have the provision to avoid default data sharing?",
          questionCode: "1.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does the solution have the provision to obtain informed, proactive consent from users?",
          questionCode: "1.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does the solution clearly describe in the consent how user data will be collected, used and shared?",
          questionCode: "1.3",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Is there a facility to obtain in separate consent (either opt-in or opt-out) to uses or disclosures for marketing purposes?",
          questionCode: "1.4",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does the solution comply with the Children's Online Privacy Protection Act with respect to collection, use or disclosure of data from and about individuals under the age of 13 including any applicable state laws?",
          questionCode: "1.5",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Are users notified in advance of the privacy policy changes?",
          questionCode: "1.6",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you ensure that users are clear on how they can withdraw consent and what will happen to their data after withdrawal?",
          questionCode: "1.7",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "On behalf of our users, do you request a copy of their health data from the HIPAA designated record set maintained by a health care provider?",
          questionCodeSystem: "Custom",
          questionCode: "1.8",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "USE and DISCLOSURE",
      questionCode: "CACC-HEADER2",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Do you via contracts bind third-party vendors to the privacy policies and prohibit use or disclosure of user information?",
          questionCode: "2.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does your solution limit the collection of health information to only what the user has expressly consented that the service can collect?",
          questionCode: "2.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does your applciation collect, use, and disclose health information in ways that are consistent with reasonable user expectations?",
          questionCode: "2.3",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "INDIVIDUAL ACCESS",
      questionCode: "CACC-HEADER3",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Does your solution provide the ability for a consumer to access their health information on their own and/or assign access to caregivers or other third-parties?",
          questionCodeSystem: "Custom",
          questionCode: "3.1",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Does your solution establish and communicate to users clear policies with respect to health information collected by the service that may not be timely, accurate, relevant or complete?",
          questionCode: "3.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Upon consumer request, is there a provision to securely dispose off the consumer's relevant identifiable health data completely and indefinitely to allow the consumer the right to be forgotten?",
          questionCodeSystem: "Custom",
          questionCode: "3.3",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "SECURITY",
      questionCode: "CACC-HEADER4",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Does your application store and retain health information in a manner consistent with industry-leading best practices that includes the highest levels of security and confidentiality?",
          questionCode: "4.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you protect health information through a combination of mechanisms including, at a minimum: secure storage, encryption of digital records both in transit and at rest, data-use agreements, and contractual obligations, and accountability measures?",
          questionCode: "4.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you follow industry-leading safeguards for how to protect a consumer's health information against such risks as loss or unauthorized access, use, destruction, annotation, or disclosure?",
          questionCode: "4.3",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you provide meaningful remedies for all participants involved in consumer-directed health information exchange to address security breaches, privacy, or other violations incurred because of misuse of the consumer's health information?",
          questionCode: "4.4",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "TRANSPARENCY",
      questionCode: "CACC-HEADER5",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Does your solution have a privacy policy that is prominent, publicly accessible, and easy to read?",
          questionCode: "5.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "In that policy do you specify the Company's data collection, consent, use, disclosure, access, security, and retention/deletion practices, including with respect to de-identified, pseudonymized or anonymized data?",
          questionCode: "5.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you provide clear updates when those practices have changed?",
          questionCode: "5.3",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you develop privacy policies based on industry best practices to manage health data?",
          questionCode: "5.4",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you specify in the privacy policy what will happen to a consumer's data in the event of a transfer of ownership or in the case of a company ending or selling its business?",
          questionCode: "5.5",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "PROVENANCE",
      questionCode: "CACC-HEADER6",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Do you provide consumers and their caregivers with data provenance to identify who or what entity originally supplied the data and, where relevant, who made changes to the data, and what changes were made?",
          questionCode: "6.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "ACCOUNTABILITY",
      questionCode: "CACC-HEADER7",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Do you designate a responsible officer committed to health information principles and to ensure the commitments are publicly facing to allow oversight enforcement by the Federal Trade Commission (FTC), State Attorneys General, or other applicable authorities?",
          questionCode: "7.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you train your employees on Accountability principles and ensure compliance by regularly evaluating the performance internally?",
          questionCode: "7.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Are you transparent with the public even when independent third-party certification is not obtained?",
          questionCodeSystem: "Custom",
          questionCode: "7.3",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "EDUCATION",
      questionCode: "CACC-HEADER8",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Do you provide educational materials to the users or point to appropriate third-party resources?",
          questionCode: "8.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you inform consumers about their health information sharing choices and the consequences of those choices including the risks, benefits, and limitations of data sharing?",
          questionCode: "8.2",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
      ],
    },
    {
      question: "AVAILABILITY",
      questionCode: "CACC-HEADER9",
      questionCodeSystem: "Custom",
      questionCardinality: {
        min: 1,
        max: 1,
      },
      header: true,
      editable: "1",
      answerCardinality: {
        min: 0,
        max: 1,
      },
      dataType: "ST",
      items: [
        {
          question:
            "Do you work to expand the set of consumer health information available for reliable, consistent electronic access and to exchange with individuals, caregivers, and clinicians?",
          questionCode: "9.1",
          questionCodeSystem: "Custom",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "BL",
        },
        {
          question:
            "Do you work to expand the amount of machine-readable data to ensure a consumer can electronically access all of their health information when, where, and how they want to achieve their goals?",
          questionCodeSystem: "Custom",
          questionCode: "9.2",
          questionCardinality: {
            min: 1,
            max: 1,
          },
          header: false,
          editable: "1",
          answerCardinality: {
            min: 0,
            max: 1,
          },
          dataType: "ST",
        },
      ],
    },
  ],
  templateOptions: {
    showFormHeader: false,
    hideFormControls: true,
    hideUnits: true,
    obrHeader: false,
    hideHeader: true,
    allowHTMLInInstructions: true,
    allowMultipleEmptyRepeatingItems: false,
    showColumnHeaders: false,
  },
};

export default form;
