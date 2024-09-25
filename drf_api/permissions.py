from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission class that allows:
    - Read-only access to any user.
    - Full access (create, update, delete) only to the owner of the object.

    Ownership is determined by checking for either an 'owner' or 'created_by' attribute on the object.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        has_owner = hasattr(obj, 'owner')
        has_created_by = hasattr(obj, 'created_by')

        if has_owner and obj.owner == request.user:
            return True
        elif has_created_by and obj.created_by == request.user:
            return True
        else:
            return False

