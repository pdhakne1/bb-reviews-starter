using bb.reviews as ReviewsTbl from '../db/data-model';
service CatalogService {
   entity Reviews @(
		title: 'BB Reviews',
		Capabilities: {
			InsertRestrictions: {Insertable: true},
			UpdateRestrictions: {Updatable: true},
			DeleteRestrictions: {Deletable: true}
		}
	) as projection on ReviewsTbl;
 }