def get_client_ip(request):
    """
    This function retrieves the client IP address from the given HttpRequest object.
    Args:
        request: An HttpRequest object representing the request.
    Returns:
        A string representing the client IP address.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip
