---
title: Syft And Grype Integration
date: 2025-12-10
tags:
  - Syft
  - Grype
  - Vulnerability Scanning
  - Security
  - Containers
---

Recent supply chain attacks have highlighted the need for robust vulnerability management in Node projects. While NPM Audit provides a basic level of security scanning, it has limitations that can leave projects exposed.

This post explores how to enhance your security posture by integrating Software Bill of Materials (SBOM) generation with Syft and vulnerability scanning with Grype into Node projects.

## Moving Beyond NPM Audit

NPM audit is a useful tool for identifying known vulnerabilities in your dependencies. However, it has several limitations: It does not cover all types of dependencies, may miss vulnerabilities in transitive dependencies, will not handle supply chains attacks until after they've caused damage,and relies on the NPM advisory database, which may not be comprehensive or up-to-date.

For larger projects, those that require to comply with security standards or those that want to proactively manage vulnearabilities, a more robust solution like SBOM generation and vulnerability scanning is necessary.

## Defining Terminology

Before we jump into the tools and processes, let's clarify key terms.

### What Is A SBOM?

A [Software Bill of Materials (SBOM)](https://www.cisa.gov/sbom) is a detailed inventory of all components, libraries, and dependencies used in a software project. It provides transparency into the software supply chain, allowing organizations to track and manage the components they use.

SBOMs produce far more comprehensive dependency graphs than what is available through `npm ls` or `package-lock.json`, including transitive dependencies and their versions. This detailed view is crucial for effective vulnerability management.

### What Is Vulnerability Scanning?

Vulnerability scanning is the process of identifying, classifying, and addressing security weaknesses in software components. It helps organizations detect potential security risks before they can be exploited.

In Node projects, vulnerability scanning involves analyzing the dependencies listed in the SBOM against known vulnerability databases to identify any security issues. This goes beyond what `npm audit` offers by providing a more comprehensive view of the project's security posture.

## Automated SBOM Generation with Syft

The tool I've chosen for generating SBOMs is [Syft](https://github.com/anchore/syft). The idea is that we'll generate the SBOM as part of the build process as a JSON file that we can use with Grype for vulnerability scanning.

### Installation

In macOS you can install Syft using Homebrew:

```bash
brew install syft
```

For other operating systems, refer to the [README](https://github.com/anchore/syft?tab=readme-ov-file#syft) file in the Syft repository.

### Show Dependencies

To see the dependencies in your project without generating an SBOM file, you can run the following command in the root directory of your Node project:

```bash
syft .
```

This will display a list of all detected packages and their versions in your project. If the same package appears multiple times with different versions, it indicates that multiple versions of that package are being used in your project. If different versions of the same package are present, they will be listed seprately along with their versions.

### Generating The SBOM

To generate an SBOM for your Node project, navigate to the root directory of your project and run the following command in the project's root directory:

```bash
syft . -o json > sbom.json
```

This command tells Syft to scan the current directory (`.`) and output the SBOM in JSON format to a file named `sbom.json`. You can integrate this command into your build scripts to automate SBOM generation.

### Extracting Specific Information

To extract specific information from the generated SBOM, such as package names, versions, and licenses, you can use tools like `jq` and `awk`. Here's an example command that formats the output in a readable table for further analysis.

The following command is broken into multiple lines for readability; in practice, it should be run as a single line.

```bash
syft . -o json | jq -r '.artifacts[] | [.name, .version,
(if .licenses == [] then "No license" else [ .licenses[].value ] |
join(", ") end)] | @tsv' | awk -F'\t'
'BEGIN {print "Package Name\tPackage Version\t\tLicense";
print "-------------\t---------------\t\t-------"}
{printf "%s\t%s\t%s\n", $1, $2, $3}'
```

We can use `sbom.json` generated in the previous step for multiple purposes like vulnerability scanning, license compliance checks, and inventory management. In the next section, we'll explore how to use it for vulnerability scanning with Grype.

## Vulnerability Scanning with Grype

[Grype](https://github.com/anchore/grype) is a powerful open-source vulnerability scanner that can analyze SBOMs to identify known vulnerabilities in software components. It integrates seamlessly with Syft, allowing you to leverage the SBOM generated in the previous step for comprehensive vulnerability scanning.

The analysis goes beyond what you'd get from `npm audit`, providing a deeper assessment of your project's security posture. Grype uses multiple vulnerability databases, including the [National Vulnerability Database (NVD)](https://nvd.nist.gov/), [GitHub Advisory Database](https://github.com/advisories) and others, to ensure comprehensive coverage.

### Installing Grype

In macOS you can install Grype using Homebrew:

```bash
brew install grype
```

For other operating systems, refer to the [installation instructions](https://github.com/anchore/grype?tab=readme-ov-file#installation) in the README file.

### Scanning for Vulnerabilities

To scan the SBOM generated by Syft for vulnerabilities, run the following command in the root directory of your Node project:

```bash
grype sbom:sbom.json
```

This command tells Grype to analyze the SBOM file (`sbom.json`) for known vulnerabilities. Grype will output a list of detected vulnerabilities, including their severity levels, and descriptions. This will be printed to STDOUT, usually the terminal screen.

### Writing Vulnerability Reports

To save the vulnerability report to a file in JSON format, you can redirect the output of the Grype command to a file using a command like this:

```bash
grype sbom:sbom.json -o json > vulnerabilities.json
```

The `-o` flag specifies the output format, and `> vulnerabilities.json` redirects the output to a file named `vulnerabilities.json`. You can choose other formats supported by Grype, such as `table`, `cyclonedx`, or `spdx`.

The `> vulnerabilities.json` portion redirects the output to a file named `vulnerabilities.json`. If you use a different format, make sure you change the file name accordingly so you can keep the reports organized.

## Putting It All Together

Generate `grouped_packages_with_locations.json` with package names, versions, licenses, and locations using the following command:

```bash
syft . -o json | jq '[.artifacts[] | {packageName: .name, packageVersion: .version, license: (if .licenses | length == 0 then "No license" else [ .licenses[].value ] | join(", ") end), locations: [.locations[].path]}] | group_by(.packageName + .packageVersion) | map({packageName: .[0].packageName, packageVersion: .[0].packageVersion, license: .[0].license, locations: map(.locations[]) | unique})' > grouped_packages_with_locations.json
```

Generate the vulnerability report in JSON format:

```bash
grype sbom:sbom.json -o json > vulnerabilities.json
```

Then you can combine the two JSON files using a script like the following Node.js example:

```js
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// --- ESM workaround for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Type Interfaces are removed in JavaScript ---

/**
 * Loads grouped packages and vulnerabilities, adds relevant vulnerability
 * data to each package, and writes the result to a new JSON file.
 *
 * @param {string} groupedPackagesPath Path to the grouped_packages.json file.
 * @param {string} vulnerabilitiesPath Path to the vulnerabilities.json file.
 * @param {string} outputPath Path for the final output.json file.
 */
async function addVulnerabilitiesToPackages(
  groupedPackagesPath,
  vulnerabilitiesPath,
  outputPath
) {
  try {
    // 1. Load grouped packages
    const packagesData = await readFile(groupedPackagesPath, 'utf8');
    const groupedPackages = JSON.parse(packagesData);

    // 2. Load vulnerabilities
    const vulnerabilitiesDataRaw = await readFile(vulnerabilitiesPath, 'utf8');
    const vulnerabilitiesData = JSON.parse(vulnerabilitiesDataRaw);
    const matches = vulnerabilitiesData.matches || [];

    // 3. Add vulnerabilities to packages using .map for a functional approach
    const packagesWithVulnerabilities = groupedPackages.map((pkg) => {
      const { packageName, packageVersion } = pkg;

      // Find and format relevant vulnerabilities
      const relevantVulnerabilities = matches
        .filter(
          (match) =>
            match.artifact.name === packageName &&
            match.artifact.version === packageVersion
        )
        .map((match) => {
          const vuln = match.vulnerability;
          const fixVersion = vuln.fix?.versions?.join(', ') || "No fix version available";

          return {
            id: vuln.id,
            dataResource: vuln.dataSource || 'N/A',
            description: vuln.description || 'No description available',
            fixVersion: fixVersion,
          };
        });

      // Create a new package object with vulnerabilities included
      // If no vulnerabilities were found, add the default "None" entry
      if (relevantVulnerabilities.length === 0) {
        return {
          ...pkg,
          vulnerabilities: [
            {
              id: "None",
              dataResource: "N/A",
              description: "No vulnerabilities found",
              fixVersion: "N/A"
            }
          ],
        };
      }

      return {
        ...pkg,
        vulnerabilities: relevantVulnerabilities,
      };
    });

    // 4. Write the combined data to a new file
    const outputData = JSON.stringify(packagesWithVulnerabilities, null, 2); // 2-space indentation
    await writeFile(outputPath, outputData, 'utf8');

    console.log(`Successfully processed files and saved to ${outputPath}`);

  } catch (error) {
    console.error("An error occurred during processing:", error);
  }
}

// --- Main execution ---
(async () => {
  // Define file paths (replace with your actual paths)
  // Using path.resolve to create absolute paths from the script's directory
  const groupedPackagesPath = path.resolve(
    __dirname,
    'grouped_packages_with_locations.json'
  );
  const vulnerabilitiesPath = path.resolve(
    __dirname,
    'vulnerabilities.json'
  );
  const outputPath = path.resolve(__dirname, 'final.json');

  // Run the function
  await addVulnerabilitiesToPackages(groupedPackagesPath, vulnerabilitiesPath, outputPath);
})();
```

An example of the resulting JSON structure for a package with vulnerabilities would look like this:

```json
{
  "packageName": "brace-expansion",
  "packageVersion": "1.1.11",
  "license": "MIT",
  "locations": [
    "/package-lock.json"
  ],
  "vulnerabilities": [
    {
      "id": "GHSA-v6h2-p8h4-qcjw",
      "dataResource": "https://github.com/advisories/GHSA-v6h2-p8h4-qcjw",
      "description": "brace-expansion Regular Expression Denial of Service vulnerability",
      "fixVersion": "1.1.12"
    }
  ]
}

```

## Mandatory Reporting

The requirement for software supply chain reporting, especially through a Software Bill of Materials (SBOM), is rapidly expanding across several key industries, primarily driven by government regulation and new industry standards.

Here are the most prominent industries with these requirements:

### Government and Defense

This is the most significant driver in the United States. Any organization that sells software to the U.S. federal government is or will be affected.

Key Mandates:

* [U.S. Executive Order (EO) 14028](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity): "Improving the Nation's Cybersecurity." This order explicitly requires suppliers to the federal government to provide an SBOM for their software.
* OMB Memos [M-22-18](https://www.whitehouse.gov/wp-content/uploads/2022/09/M-22-18.pdf) and [M-23-16](https://www.whitehouse.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security.pdf): M-22-18 operationalizes the executive order, setting deadlines for federal agencies to collect "self-attestations" (secure development proof) and SBOMs from their software producers. M-23-16 updates and extends these requirements.
* [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/projects/ssdf): This provides the "how-to" guide for secure practices that agencies and suppliers must follow, with SBOMs being a key artifact.
* Who it Affects
  * All federal agencies (e.g., Department of Defense, NASA) and the entire Defense Industrial Base (DIB), which includes thousands of private contractors and subcontractors.

### Critical Infrastructure

This is a broad category that is now under intense scrutiny to prevent attacks that could disrupt national security or daily life.

Key Mandates:

* [Cyber Incident Reporting for Critical Infrastructure Act of 2022](https://www.congress.gov/bill/117th-congress/house-bill/5440) (CIRCIA): This law requires "covered entities" to report significant cyber incidents to CISA within 72 hours and any ransom payments within 24 hours. While not an SBOM mandate itself, it forces organizations to have a deep understanding of their software assets to comply, making SBOMs a necessary tool.
* Who it Affects: Companies in sectors defined as "critical" by CISA, including:
  * Energy (e.g., power grids, oil, and gas)
  * Transportation Systems (e.g., aviation, rail)
  * Communications
  * Emergency Services
  * Water and Wastewater Systems
  * Information Technology

### Healthcare

Because of the direct risk to patient safety, the healthcare and medical device industry has very specific mandates.

Key Mandates:

* [FDA (Food and Drug Administration) Guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-system-considerations-and-content-premarket-submissions): The FDA has issued guidance stating that manufacturers must submit an SBOM with their premarket submissions for "cyber devices" (medical devices that can connect to a network).
* [PATCH Act](https://www.congress.gov/bill/117th-congress/house-bill/7084): Passed as part of the 2023 omnibus spending bill, this law gives the FDA legal authority to require device manufacturers to have a plan to monitor and address post-market cybersecurity vulnerabilities and provide an SBOM.
* Who it Affects
  * Manufacturers of any network-connected medical device, from infusion pumps and patient monitors to hospital management software.

### Finance

The financial sector has long-standing, strict security standards, which are now being updated to explicitly include software components.

Key Mandates:

* [PCI DSS v4.0](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0_1.pdf) (Payment Card Industry Data Security Standard): Requirement 6.3.2 explicitly requires organizations to "maintain an inventory of bespoke and custom software and third-party software components incorporated into...software" to facilitate vulnerability management. This is a direct description of an SBOM.
* Who it Affects
  * Any organization that processes, stores, or transmits credit card information, including merchants, payment processors, and financial institutions.

### International (European Union)

It's also important to note that this isn't just a U.S. trend. The EU is taking an aggressive, broad-based approach.

Key Mandates:

* [EU Cyber Resilience Act (CRA)](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act): This sweeping legislation mandates that any "product with digital elements" sold in the EU market must meet a baseline of cybersecurity standards. This includes a requirement for manufacturers to provide an SBOM, manage vulnerabilities, and be transparent with customers.
* Who it Affects
  * Any hardware or software company that wants to sell its products within the European Union.

## Conclusion: Why Is This Important?

Integrating SBOM generation with Syft and vulnerability scanning with Grype into your Node projects provides several key benefits:

1. **Comprehensive Vulnerability Detection**: By leveraging SBOMs, you gain a more complete view of your project's dependencies, including transitive dependencies that may not be covered by `npm audit`.
2. **Proactive Security Posture**: Regularly generating SBOMs and scanning for vulnerabilities helps you stay ahead of potential security threats. This proactive approach allows you to address vulnerabilities before they can be exploited.
3. **Compliance and Reporting**: Many industries have regulatory requirements for software supply chain security. Integrating these tools helps you meet compliance standards and provides detailed reports for audits.
4. **Automated Security Gates (CI/CD Integration)**: You can integrate Syft and Grype directly into your CI/CD pipelines (e.g., GitHub Actions, GitLab CI). This allows you to automatically "fail a build" if a new, high-severity vulnerability is detected, preventing insecure code from being merged or deployed. This shifts security from a manual check to an automated, preventative control.
5. **License Discovery and Compliance**: The SBOM generated by Syft doesn't just list components; it also identifies their software licenses (e.g., MIT, Apache 2.0, GPL). This is crucial for legal and business risk management. It helps you ensure you aren't accidentally using a library with a restrictive license that conflicts with your project's goals or legal obligations.

By adopting these practices, you can significantly enhance the security and reliability of your Node projects, protecting both your users and your organization from potential threats.
