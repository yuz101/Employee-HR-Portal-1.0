const DocumentService = require('../services/DocumentService');
const fs = require('fs');

const documentService = new DocumentService();

exports.uploadSingleDocument = async (req, res) => {
    let documentType = req.body.documentType;
    if (!req.token.userId) {
        employeeId = '123';
    }

    try {
        await documentService.uploadEmployeeDocument({
            employeeId: req.token.userId,
            filePath: req.file.path,
            documentType: documentType,
        });
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(404);
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
}

exports.getDownloadLinkForOneEmployeeDocument = async (req, res) => {
    const { employeeId, documentType } = req.query;
    try {
        if (!documentType) {
            const downloadLinks = await documentService.getAllDocumentDownloadLinksForEmployee({
                employeeId: employeeId,
            });
            return res.status(200).json({ downloadLinks });
        }
        
        const downloadLink = await documentService.getDocumentDownloadLinkForEmployee({
            employeeId: employeeId,
            documentType: documentType,
        });
        return res.status(200).json({ downloadLink });
    } catch (error) {
        console.error(error);
        return res.status(404).json({ error: 'Document not found' });
    }
}

exports.getEmployeeWorkAuthorizationStatus = async (req, res) => {
    const { employeeId } = req.body;
    try {
        
    } catch (error) {
        console.error(error);
        return res.sendStatus(404);
    }
}