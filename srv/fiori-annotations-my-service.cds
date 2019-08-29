using CatalogService as cats from './my-service';


annotate cats.Reviews with @( // header-level annotations
// ---------------------------------------------------------------------------
// List Report
// ---------------------------------------------------------------------------
	// Foods List
	UI: {
		LineItem: [ 
			{$Type: 'UI.DataField', Value: reviewee_email, "@UI.Importance":#High},		
			{$Type: 'UI.DataField', Value: reviewer_email, "@UI.Importance":#High},		
			{$Type: 'UI.DataField', Value: rating, "@UI.Importance":#High},
			{$Type: 'UI.DataField', Value: comment, "@UI.Importance":#Medium}
 		],
 		PresentationVariant: {
			SortOrder: [ {$Type: 'Common.SortOrderType', Property:  reviewee_email, Descending: false}, {$Type: 'Common.SortOrderType', Property: reviewer_email, Descending: false} ]
		}
	}
);