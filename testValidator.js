const xsdValidator = require('xsd-schema-validator');
const fs = require('fs');
const path = require('path');

const xmlData = `<note>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
</note>`;

const xsdContent = `
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="note">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="to" type="xs:string"/>
                <xs:element name="from" type="xs:string"/>
                <xs:element name="heading" type="xs:string"/>
                <xs:element name="body" type="xs:string"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
</xs:schema>`;

const xsdFilePath = path.join(__dirname, 'schema.xsd');
fs.writeFileSync(xsdFilePath, xsdContent);
console.log(`Esquema XSD guardado en: ${xsdFilePath}`);

const writtenContent = fs.readFileSync(xsdFilePath, 'utf8');
console.log("Contenido del esquema escrito:", writtenContent);

async function validateXML() {
    await xsdValidator.validateXML(xmlData, xsdFilePath, (err, result) => {
        if (err) {
            console.error('Error de validación:', err);
        } else {
            console.log('¿Es válido?', result.valid);
            if (!result.valid) {
                console.log('Errores:', result.errors);
            } else {
                console.log('El XML es válido.');
            }
        }
    });
}

validateXML();