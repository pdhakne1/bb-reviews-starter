namespace bb;

entity reviews {
	key reviewee_email : String @(title: 'Reviewee Email', Common.FieldControl: #Mandatory, Search.defaultSearchElement, Common.Label: 'Reviewee Email');
	key reviewer_email: String @(title: 'Reviewer Email', Common.FieldControl: #Mandatory, Common.Label: 'Reviewer Email');
	rating: Integer  @title: 'Rating';
	comment: String @title: 'Comment';
}
