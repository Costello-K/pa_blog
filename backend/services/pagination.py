from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


class SettingsPageNumberPagination(PageNumberPagination):
    """Class for basic page pagination settings"""
    page_query_param = 'page'  # Name of the page number parameter in the URL
    page_size_query_param = 'page_size'  # Name of the page size parameter in the URL
    max_page_size = 50
    page_size = 10

    def get_paginated_response(self, data):
        """Customized pagination response"""
        return Response({
            'results': data,
            'total_pages': self.page.paginator.num_pages,
            'count': self.page.paginator.count,  # Total number of items
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            }
        })


class SettingsCommentPagination(SettingsPageNumberPagination):
    """Class for basic page pagination settings"""
    page_size = 5
