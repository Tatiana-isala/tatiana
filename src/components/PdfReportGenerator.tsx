
'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Student, Classroom, Course, Grade } from '@/lib/db'

interface PdfReportData {
  student: Student
  classroom: Classroom
  courses: Course[]
  grades: Record<string, Grade>
}

export const PdfReportGenerator = {
  generateReport: (data: PdfReportData) => {
    // Initialisation du document PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const currentDate = new Date().toLocaleDateString('fr-FR')

    // 1. En-tête du bulletin
    doc.setFontSize(16)
    doc.setTextColor(40, 53, 147)
    doc.setFont('helvetica', 'bold')
    doc.text('BULLETIN SCOLAIRE', pageWidth / 2, 20, { align: 'center' })

    // 2. Informations de l'établissement
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`Année scolaire: ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, margin, 30)
    doc.text(`Date d'édition: ${currentDate}`, margin, 36)

    // 3. Informations de l'élève
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMATIONS ÉLÈVE', margin, 50)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Nom complet: ${data.student.nom} ${data.student.post_nom} ${data.student.prenom}`, margin, 60)
    doc.text(`Classe: ${data.classroom.name}`, margin, 66)
    doc.text(`Matricule: ${data.student.matricule}`, margin, 72)
    doc.text(`Date de naissance: ${new Date(data.student.date_naissance).toLocaleDateString('fr-FR')}`, margin, 78)

    // 4. Préparation des données du tableau
    const tableData = data.courses.map(course => {
      const grade = data.grades[course.id] || {}
      return [
        course.name,
        grade.P1?.toString() || '-',
        grade.P2?.toString() || '-',
        grade.Examen1?.toString() || '-',
        grade.S1?.toString() || '-',
        grade.P3?.toString() || '-',
        grade.P4?.toString() || '-',
        grade.Examen2?.toString() || '-',
        grade.S2?.toString() || '-',
        grade.total?.toString() || '-',
        grade.appreciation || '-'
      ]
    })

    // 5. Calcul de la moyenne générale
    const validGrades = data.courses
      .map(course => data.grades[course.id]?.total)
      .filter(total => total !== undefined) as number[]

    const overallAverage = validGrades.length > 0
      ? validGrades.reduce((acc, curr) => acc + curr, 0) / validGrades.length
      : null

    // 6. Création du tableau avec autoTable
    autoTable(doc, {
      startY: 90,
      margin: { top: 90, bottom: 40 }, // Réserver de l'espace pour le pied de page
      head: [
        [
          'Matière', 
          'P1', 
          'P2', 
          'Examen', 
          'Session 1', 
          'P3', 
          'P4', 
          'Examen', 
          'Session 2', 
          'Total', 
          'Appréciation'
        ]
      ],
      body: tableData,
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
    //   margin: { left: margin, right: margin },
    })

    // 7. Ajout du pied de page après le tableau
    const finalY = (doc as any).lastAutoTable?.finalY || 90
    let footerY = finalY + 15

    // Vérifier si on a besoin d'une nouvelle page
    if (footerY + 40 > pageHeight) {
      doc.addPage()
      footerY = 20
    }

    // Résultats globaux
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('RÉSULTAT GLOBAL', margin, footerY)

    doc.setFont('helvetica', 'normal')
    doc.text(`Moyenne générale: ${overallAverage?.toFixed(2) || '-'}`, margin, footerY + 8)
    doc.text(`Pourcentage: ${overallAverage?.toFixed(2) || '-'}%`, margin, footerY + 16)
    doc.text(`Appréciation: ${getAppreciation(overallAverage)}`, margin, footerY + 24)

    // Signature
    const signatureY = footerY + 40
    if (signatureY < pageHeight - 10) {
      doc.text('Signature du titulaire: ________________________', pageWidth - margin - 80, signatureY)
    }

    // 8. Sauvegarde du PDF
    doc.save(
      `Bulletin_${data.student.matricule}_${data.student.nom}_${currentDate.replace(/\//g, '-')}.pdf`
    )
  }
}

// Fonction helper pour l'appréciation
function getAppreciation(average: number | null): string {
  if (average === null) return 'Non évalué'
  if (average >= 80) return 'Excellent'
  if (average >= 70) return 'Très bien'
  if (average >= 60) return 'Bien'
  if (average >= 50) return 'Satisfaisant'
  if (average >= 30) return 'Insuffisant'
  return 'Médiocre'
}